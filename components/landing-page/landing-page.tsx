"use client";

import { Instructions } from "@/components/instructions";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Text } from '@radix-ui/themes';

const BlobBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <AnimatePresence>
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-cyan-500/30 to-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </AnimatePresence>
    </div>
  );
};

export function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <BlobBackground />
      
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <motion.h1 
          className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Text as="span" size="9" weight="bold" className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            Human Context Protocol
          </Text>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-200 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Text as="span" size="5" color="gray" className="text-gray-200 leading-relaxed">
            NeurIPS AI Conference Research Paper Demo
          </Text>
        </motion.p>

        <motion.p 
          className="text-lg text-gray-300 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Text as="span" size="4" color="gray" className="text-gray-300 leading-relaxed">
            A demonstration of of the Human Context Protocol allowing user to transfer their preferences between AI tools via MCP.
          </Text>
        </motion.p>

        <motion.div 
          className="flex gap-4 justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button
            asChild
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-full"
          >
            <Link href="/context">
              See Dashboard
            </Link>
          </Button>
          
          <Instructions openButtonLabel="Connect to MCP" />
        </motion.div>
      </div>
    </div>
  );
} 