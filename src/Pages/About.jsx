import React from 'react';
import { Card } from 'antd';
import { FaRegCalendarAlt, FaUserAlt, FaRegLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Images for each card
import JAMS from '../Assets/JAMS.jpg'; // Replace with actual images
import jams1 from '../Assets/jams1.jpg'; // Replace with actual images
import jamshop from '../Assets/jamshop.jpg'; // Replace with actual images
import shop1 from '../Assets/shop1.jpg'; // Replace with actual images

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl text-center font-bold mb-12" style={{ fontFamily: 'Spicy Rice, cursive' }}>
        About JamsFragrances
      </h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-8">
        {/* About Card 1 - Website Info */}
        <motion.div
          className="relative bg-gradient-to-br from-pink-400 to-red-400 p-6 shadow-xl rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className="bg-transparent"
            title="About Our Shop"
            bordered={false}
            cover={<img alt="Shop Image" src={jamshop} className="w-full h-auto object-cover rounded-t-lg" />}
          >
            <p className="text-white">
              JamsFragrances is a premium online shop dedicated to providing high-quality perfumes that embody elegance,
              sophistication, and lasting impressions. Our collection features a wide range of fragrances for every
              occasion, crafted with care to satisfy our customers' unique tastes and preferences.
            </p>
          </Card>
        </motion.div>

        {/* About Card 2 - Founder */}
        <motion.div
          className="relative bg-gradient-to-br from-pink-400 to-red-400 p-6 shadow-xl rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className="bg-transparent"
            title="The Founder"
            bordered={false}
            cover={<img alt="Founder" src={jams1} className="w-full h-auto object-cover rounded-t-lg" />}
          >
            <div className="flex items-center space-x-4">
              <FaUserAlt className="text-white text-3xl" />
              <p className="text-white">
                JamsFragrances was founded by <strong>Jamshed Khan</strong>, a visionary entrepreneur with a passion
                for creating exceptional fragrances. His dedication to quality and customer satisfaction has been the
                driving force behind the success of the brand.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* About Card 3 - CEO */}
        <motion.div
          className="relative bg-gradient-to-br from-pink-400 to-red-400 p-6 shadow-xl rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className="bg-transparent"
            title="CEO"
            bordered={false}
            cover={<img alt="CEO" src={JAMS} className="w-full h-auto object-cover rounded-t-lg" />}
          >
            <div className="flex items-center space-x-4">
              <FaUserAlt className="text-white text-3xl" />
              <p className="text-white">
                The CEO of JamsFragrances is <strong>Jamshed Khan</strong>. His expertise and leadership ensure that
                every product meets the highest standards of excellence, making JamsFragrances a trusted name in the
                world of luxury perfumes.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* About Card 4 - Launch Date */}
        <motion.div
          className="relative bg-gradient-to-br from-pink-400 to-red-400 p-6 shadow-xl rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className="bg-transparent"
            title="Launch Date"
            bordered={false}
            cover={<img alt="Launch Date Image" src={shop1} className="w-full h-auto object-cover rounded-t-lg" />}
          >
            <div className="flex items-center space-x-4">
              <FaRegCalendarAlt className="text-white text-3xl" />
              <p className="text-white">
                JamsFragrances launched on <strong>January 1, 2025</strong>. Since then, we have been committed to
                providing our customers with unforgettable scents and exceptional service.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* About Card 5 - Our Purpose */}
        <motion.div
          className="relative bg-gradient-to-br from-pink-400 to-red-400 p-6 shadow-xl rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className="bg-transparent"
            title="Our Purpose"
            bordered={false}
            cover={<img alt="Purpose Image" src={jamshop} className="w-full h-auto object-cover rounded-t-lg" />}
          >
            <div className="flex items-center space-x-4">
              <FaRegLightbulb className="text-white text-3xl" />
              <p className="text-white">
                At JamsFragrances, our mission is to bring luxury fragrances within everyone's reach. We are dedicated
                to enhancing your everyday experiences with scents that evoke beauty, confidence, and timelessness.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
