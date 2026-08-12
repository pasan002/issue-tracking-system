/**
 * DNS Fix for MongoDB Atlas connectivity
 * 
 * Some ISP/network DNS servers fail to resolve MongoDB Atlas hostnames.
 * This module overrides Node.js dns.lookup to use Google DNS (8.8.8.8)
 * for any *.mongodb.net hostnames.
 * 
 * Must be required BEFORE mongoose or mongodb driver imports.
 */
const dns = require('dns');
const { Resolver } = dns;

const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4']);

// Also set default servers for SRV/TXT lookups
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Cache resolved IPs to avoid repeated lookups
const dnsCache = new Map();

// Override dns.lookup to use Google DNS for mongodb.net hostnames
const originalLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
  // Normalize arguments - dns.lookup has multiple signatures:
  // dns.lookup(hostname, callback)
  // dns.lookup(hostname, family, callback)
  // dns.lookup(hostname, options, callback)
  if (typeof options === 'function') {
    callback = options;
    options = {};
  } else if (typeof options === 'number') {
    options = { family: options };
  }
  if (!options) options = {};

  // For MongoDB Atlas hostnames, resolve via Google DNS
  if (hostname && hostname.includes('mongodb.net')) {
    // Check cache first
    if (dnsCache.has(hostname)) {
      const ip = dnsCache.get(hostname);
      if (options.all) {
        // When all:true, callback expects (err, [{address, family}])
        return process.nextTick(() => callback(null, [{ address: ip, family: 4 }]));
      }
      return process.nextTick(() => callback(null, ip, 4));
    }

    resolver.resolve4(hostname, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        // Fall back to OS resolver
        return originalLookup.call(dns, hostname, options, callback);
      }
      const ip = addresses[0];
      dnsCache.set(hostname, ip);
      if (options.all) {
        // When all:true, callback expects (err, [{address, family}])
        callback(null, addresses.map(addr => ({ address: addr, family: 4 })));
      } else {
        callback(null, ip, 4);
      }
    });
  } else {
    originalLookup.call(dns, hostname, options, callback);
  }
};

console.log('[DNS Fix] Google DNS override active for *.mongodb.net');
