/**
 * This file contains the code that initializes and exports the PrismaClient
 * instance, which is the main entry point for our database code.
 *
 * We use a global variable to store the PrismaClient instance, so that we can
 * reuse the same instance for all requests. This is important because we want
 * to take advantage of Prisma's connection pooling.
 *
 * We also set the transaction options for the PrismaClient instance. We want
 * to set a maximum wait time of 5 seconds and a timeout of 10 seconds for
 * transactions.
 */

import { PrismaClient } from "@prisma/client";

/**
 * We need to create a global that persists between requests, so that we can
 * reuse the same PrismaClient instance for all requests.
 *
 * We use the "globalThis" object, which is a new feature in modern browsers
 * and Node.js versions. It's a way to access the global object without
 * having to use the `window` or `global` keywords, which can be ambiguous.
 *
 * We cast the globalThis object to an object that has a "prisma" property,
 * which is where we'll store our PrismaClient instance.
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

/**
 * This is the main entry point for our database code. We'll use this
 * function to get a reference to our PrismaClient instance.
 *
 * If the globalForPrisma.prisma property is already set, we'll reuse that
 * instance. This is important because we want to reuse the same instance
 * for all requests, so that we can take advantage of Prisma's connection
 * pooling.
 *
 * If the globalForPrisma.prisma property is not set, we'll create a new
 * PrismaClient instance and store it in the globalForPrisma.prisma property.
 *
 * We pass an options object to the PrismaClient constructor that sets
 * the transaction options. We want to set a maximum wait time of 5 seconds
 * and a timeout of 10 seconds for transactions.
 */
export const db =
	globalForPrisma.prisma ||
	new PrismaClient({
		transactionOptions: {
			maxWait: 5000,
			timeout: 10_000,
		},
	});

/**
 * If we're not in production mode, we'll assign the PrismaClient instance
 * to the globalForPrisma.prisma property, so that we can reuse the same
 * instance for all requests.
 */
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
