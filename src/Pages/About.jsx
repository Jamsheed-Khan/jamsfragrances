// import React from 'react';
// import { Card } from 'antd';
// import { FaRegCalendarAlt, FaUserAlt, FaRegLightbulb } from 'react-icons/fa';
// import { motion } from 'framer-motion';

// // Images for each card
// import shopImage from '../Assets/shopImage.jpg'; // Replace with actual images
// import founderImage from '../Assets/founderImage.jpg'; // Replace with actual images
// import ceoImage from '../Assets/ceoImage.jpg'; // Replace with actual images

// const About = () => {
//   return (
//     <div className="container mx-auto px-4 py-12">
//       <h1 className="text-4xl text-center font-bold mb-12" style={{ fontFamily: 'Spicy Rice, cursive' }}>
//         About This Website
//       </h1>

//       <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-8">
//         {/* About Card 1 - Website Info */}
//         <motion.div
//           className="relative bg-gradient-to-br from-pink-400 to-red-400 p-6 shadow-xl rounded-lg"
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Card
//             className="bg-transparent"
//             title="Website Information"
//             bordered={false}
//             cover={<img alt="Shop Image" src={shopImage} className="w-full h-48 object-cover rounded-t-lg" />}
//           >
//             <p className="text-white">
//               This is a blogging website created for users to share their thoughts, ideas, and articles. We aim to create a platform where people can freely express themselves, read interesting blogs, and engage with others in the community. Our website allows users to sign up, post blogs, comment on posts, and much more.
//             </p>
//           </Card>
//         </motion.div>

//         {/* About Card 2 - Founder */}
//         <motion.div
//           className="relative bg-gradient-to-br from-pink-400 to-red-400 p-6 shadow-xl rounded-lg"
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Card
//             className="bg-transparent"
//             title="The Founder"
//             bordered={false}
//             cover={<img alt="Founder" src={founderImage} className="w-full h-48 object-cover rounded-t-lg" />}
//           >
//             <div className="flex items-center space-x-4">
//               <FaUserAlt className="text-white text-3xl" />
//               <p className="text-white">
//                 The website was created by <strong>Jamshed Khan</strong>, a passionate web developer with a keen interest in JavaScript, React, and Firebase. Jamshed is dedicated to building professional and user-friendly websites and has been honing his skills over several years.
//               </p>
//             </div>
//           </Card>
//         </motion.div>

//         {/* About Card 3 - CEO */}
//         <motion.div
//           className="relative bg-gradient-to-br from-pink-400 to-red-400 p-6 shadow-xl rounded-lg"
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Card
//             className="bg-transparent"
//             title="CEO"
//             bordered={false}
//             cover={<img alt="CEO" src={ceoImage} className="w-full h-48 object-cover rounded-t-lg" />}
//           >
//             <div className="flex items-center space-x-4">
//               <FaUserAlt className="text-white text-3xl" />
//               <p className="text-white">
//                 The CEO of the website is <strong>Jamshed Khan</strong>. He leads the development of the website, working to make it a platform that fosters creativity, community, and free expression. His vision is to create a space where users can connect, share ideas, and engage with others around the world.
//               </p>
//             </div>
//           </Card>
//         </motion.div>

//         {/* About Card 4 - Launch Date */}
//         <motion.div
//           className="relative bg-gradient-to-br from-pink-400 to-red-400 p-6 shadow-xl rounded-lg"
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Card
//             className="bg-transparent"
//             title="Launch Date"
//             bordered={false}
//             cover={<img alt="Launch Date Image" src={ceoImage} className="w-full h-48 object-cover rounded-t-lg" />}
//           >
//             <div className="flex items-center space-x-4">
//               <FaRegCalendarAlt className="text-white text-3xl" />
//               <p className="text-white">
//                 This website was launched on <strong>January 1, 2025</strong>. We are continuously working to improve the platform by adding new features and ensuring a smooth user experience. Stay tuned for upcoming updates and enhancements!
//               </p>
//             </div>
//           </Card>
//         </motion.div>

//         {/* About Card 5 - Purpose */}
//         <motion.div
//           className="relative bg-gradient-to-br from-pink-400 to-red-400 p-6 shadow-xl rounded-lg"
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Card
//             className="bg-transparent"
//             title="Our Purpose"
//             bordered={false}
//             cover={<img alt="Purpose Image" src={ceoImage} className="w-full h-48 object-cover rounded-t-lg" />}
//           >
//             <div className="flex items-center space-x-4">
//               <FaRegLightbulb className="text-white text-3xl" />
//               <p className="text-white">
//                 Our mission is to provide a safe, creative, and interactive platform for users to share their stories and ideas. We aim to bring people together through the power of written words and foster a positive online environment.
//               </p>
//             </div>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default About;
