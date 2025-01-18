'use client'
import React from "react";
import { motion } from "framer-motion";
import { FaXTwitter, FaFacebookF, FaInstagram,  FaYoutube,  FaBluesky, FaTiktok,  FaRedditAlien, FaLinkedinIn } from "react-icons/fa6";

const SocialMediaIcons: React.FC = () => {
  const icons = [
    { Icon: FaXTwitter, href: "https://x.com/wibblitofficial" },
    { Icon: FaBluesky, href: "https://bsky.app/profile/wibblit.bsky.social" },
    { Icon: FaFacebookF, href: "https://www.facebook.com/profile.php?id=61567985016999" },
    { Icon: FaInstagram, href: "https://www.instagram.com/wibblitofficial/" },
    { Icon: FaRedditAlien, href: "https://www.reddit.com/r/wibblit/" },
    { Icon: FaYoutube, href: "https://www.youtube.com/@wibblitofficial" },
    { Icon: FaTiktok, href: "https://www.tiktok.com/@wibblit" },
    { Icon: FaLinkedinIn, href: "https://www.linkedin.com/company/wibblit" },
  ];

  return (
    <motion.div
      className="flex flex-row md:flex-col justify-end md:justify-start space-x-4 md:space-x-0 md:space-y-4 p-4 rounded-2xl bg-transparent backdrop-blur-md"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      {icons.map(({ Icon, href }, index) => (
        <motion.a
          key={index}
          href={href}
          target="_blank"
          className="text-white hover:text-gray-300 transition-colors duration-200"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Icon size={24} />
        </motion.a>
      ))}
    </motion.div>
  );
};

export default SocialMediaIcons;

