/*
  # Add Sample News Data

  1. Sample Articles
    - Adds 8 diverse news articles across different categories
    - Covers breeding, sustainability, education, health, events, and updates
    - Includes realistic content with proper dates and images
    - Articles span different time periods for variety

  2. Content Coverage
    - Breeding program announcements
    - Sustainability initiatives
    - Educational workshops and guides
    - Health and care updates
    - Farm events and shows
    - General farm updates
*/

-- Insert sample news articles
INSERT INTO news_items (title, excerpt, content, date, image_url, category) VALUES
(
  'New Breeding Program for Heritage Rabbits Launched',
  'We are excited to announce the launch of our new heritage rabbit breeding program, focusing on rare and endangered breeds to preserve genetic diversity.',
  'After months of planning and preparation, we are thrilled to introduce our new heritage rabbit breeding program. This initiative focuses on preserving rare and endangered rabbit breeds that are at risk of disappearing from the agricultural landscape.

Our program will feature several heritage breeds including the American Blue, Silver Fox, and Blanc de Hotot rabbits. These breeds were once common on American farms but have seen declining numbers in recent decades.

The breeding program emphasizes genetic diversity, health testing, and maintaining breed standards as established by the American Rabbit Breeders Association. Each breeding pair is carefully selected based on pedigree, health records, and conformity to breed standards.

We believe that preserving these heritage breeds is not just about maintaining genetic diversity, but also about preserving agricultural history and providing sustainable options for small-scale farmers and homesteaders.',
  '2024-01-15',
  'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Breeding'
),
(
  'Sustainable Farming Practices: Our Zero-Waste Initiative',
  'Learn about our comprehensive zero-waste initiative that transforms farm by-products into valuable resources for the community.',
  'Sustainability has always been at the heart of our farming philosophy, and we are proud to announce our new zero-waste initiative that aims to eliminate waste while creating valuable resources for our community.

Our comprehensive program focuses on several key areas:

**Manure Management**: All animal waste is composted using a three-stage process that produces premium organic fertilizer. This compost is tested for nutrient content and safety before being offered to local gardeners and farmers.

**Bedding Recycling**: Used bedding materials are processed and repurposed as mulch for landscaping projects. This reduces waste while providing a valuable soil amendment.

**Feed Optimization**: We have partnered with local grain producers to source feed ingredients that would otherwise go to waste, such as brewery grains and vegetable processing by-products.

**Water Conservation**: Our new rainwater collection system captures and stores water for non-drinking uses, reducing our reliance on municipal water supplies.

The initiative has already shown impressive results, with a 75% reduction in waste sent to landfills and the creation of over 500 cubic yards of premium compost in the first six months.',
  '2024-01-08',
  'https://images.pexels.com/photos/4588000/pexels-photo-4588000.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Sustainability'
),
(
  'Monthly Educational Workshops Now Available',
  'Join our expert team for hands-on workshops covering animal care, breeding basics, and sustainable farming practices.',
  'We are excited to announce the launch of our monthly educational workshop series, designed to share our knowledge and expertise with animal enthusiasts, aspiring farmers, and current livestock owners.

**Workshop Schedule**:

*First Saturday of Each Month*: "Animal Care Fundamentals" - covering nutrition, housing, health monitoring, and basic veterinary care across all species.

*Second Saturday*: "Breeding Basics" - an introduction to selective breeding, genetics, record keeping, and breeding program management.

*Third Saturday*: "Sustainable Practices" - focusing on environmental stewardship, waste management, and resource conservation.

*Fourth Saturday*: "Species-Specific Care" - rotating monthly between rabbits, guinea pigs, dogs, cats, and fowl.

Each workshop is limited to 12 participants to ensure personalized attention and hands-on learning opportunities. Participants will receive comprehensive handouts, access to our resource library, and ongoing support via our online community forum.

Our workshops are led by our experienced team members, each with specialized expertise in their respective areas. We also regularly invite guest speakers, including veterinarians, nutritionists, and successful breeders from the region.

Registration is now open for the next three months, with early bird pricing available for those who sign up for multiple workshops.',
  '2024-01-22',
  'https://images.pexels.com/photos/4588015/pexels-photo-4588015.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Education'
),
(
  'Health Monitoring Technology Upgrade',
  'We have invested in new health monitoring technology to ensure the highest standards of animal welfare and early disease detection.',
  'Animal health and welfare are our top priorities, which is why we have invested in state-of-the-art health monitoring technology to enhance our care protocols and ensure early detection of any health issues.

**New Technology Implementations**:

**Digital Health Records**: Every animal now has a comprehensive digital health record that tracks vaccinations, treatments, weight changes, and behavioral observations. This system allows us to identify trends and potential issues before they become serious problems.

**Automated Monitoring Systems**: We have installed environmental monitoring systems in all housing areas that track temperature, humidity, air quality, and lighting conditions. These systems send alerts if conditions fall outside optimal ranges.

**Nutritional Analysis**: Our new feed analysis equipment allows us to test the nutritional content of all feed ingredients, ensuring optimal nutrition for each species and life stage.

**Veterinary Partnerships**: We have expanded our veterinary support network to include specialists in exotic animal medicine, reproduction, and nutrition. This ensures access to expert care when needed.

**Preventive Care Protocols**: Enhanced vaccination schedules, parasite prevention programs, and regular health screenings are now standard for all animals.

The investment in these technologies reflects our commitment to providing the highest standard of care while maintaining transparency with our customers about the health and welfare of our animals.',
  '2024-01-29',
  'https://images.pexels.com/photos/4588005/pexels-photo-4588005.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Health'
),
(
  'Spring Farm Open House and Animal Show',
  'Join us for our annual Spring Open House featuring animal demonstrations, educational exhibits, and meet-and-greet opportunities.',
  'Mark your calendars for our annual Spring Farm Open House, scheduled for April 15th from 10 AM to 4 PM. This family-friendly event offers visitors the opportunity to see our facilities, meet our animals, and learn about sustainable farming practices.

**Event Highlights**:

**Facility Tours**: Guided tours of our breeding facilities, nurseries, and sustainable farming installations. Tours run every 30 minutes and are led by our knowledgeable staff.

**Animal Demonstrations**: Live demonstrations of proper handling techniques, grooming procedures, and basic training methods for different species.

**Educational Exhibits**: Interactive displays covering topics such as genetics, nutrition, housing requirements, and breed characteristics.

**Meet the Animals**: Supervised opportunities to interact with friendly animals, perfect for families with children.

**Local Vendor Market**: Local artisans and agricultural suppliers will showcase their products, including handmade animal accessories, organic feeds, and farming equipment.

**Food and Refreshments**: Local food vendors will provide farm-to-table meals and refreshments throughout the day.

**Expert Presentations**: Short presentations by our team and guest experts on topics such as "Choosing the Right Breed for Your Lifestyle" and "Setting Up Your First Animal Housing."

Admission is free, though donations to support our heritage breed conservation efforts are gratefully accepted. Parking is available on-site, and the event will proceed rain or shine with indoor alternatives available.',
  '2024-02-05',
  'https://images.pexels.com/photos/4588020/pexels-photo-4588020.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Events'
),
(
  'New Partnership with Local Veterinary College',
  'We are proud to announce our new educational partnership with the Regional Veterinary College to advance animal care research and education.',
  'We are excited to announce a new partnership with the Regional Veterinary College that will benefit both our farm operations and the broader agricultural community through enhanced research and educational opportunities.

**Partnership Benefits**:

**Research Collaboration**: Veterinary students and faculty will conduct research projects on our farm, focusing on areas such as nutrition optimization, reproductive efficiency, and disease prevention strategies.

**Student Internships**: The partnership provides hands-on learning opportunities for veterinary students, giving them real-world experience with diverse animal species and farming operations.

**Continuing Education**: Our staff will have access to continuing education programs and the latest research findings in animal health and welfare.

**Community Outreach**: Joint educational programs will be offered to the public, combining academic expertise with practical farming experience.

**Health Protocols**: The college will assist in developing and refining our health management protocols, ensuring we maintain the highest standards of animal care.

**Research Publications**: Findings from collaborative research projects will be published in veterinary journals, contributing to the broader knowledge base in animal agriculture.

This partnership represents our commitment to continuous improvement and our belief in the importance of science-based animal care. We look forward to the innovations and improvements that will result from this collaboration.',
  '2024-02-12',
  'https://images.pexels.com/photos/4588008/pexels-photo-4588008.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Updates'
),
(
  'Guinea Pig Care Guide: Winter Housing Tips',
  'Essential tips for keeping your guinea pigs healthy and comfortable during the colder months, including housing, nutrition, and health considerations.',
  'As winter approaches, guinea pig owners need to take special precautions to ensure their pets remain healthy and comfortable during the colder months. Guinea pigs are particularly sensitive to temperature changes and require specific care adjustments for winter.

**Housing Considerations**:

**Temperature Control**: Guinea pigs are most comfortable in temperatures between 65-75°F. Avoid placing cages near drafts, windows, or heating vents that can cause temperature fluctuations.

**Bedding**: Increase bedding depth during winter to provide extra insulation. Paper-based beddings or kiln-dried pine shavings work well for warmth and absorption.

**Shelter Options**: Provide additional hiding places and cozy shelters where guinea pigs can huddle together for warmth.

**Nutrition Adjustments**:

**Increased Calories**: Guinea pigs may need slightly more food during winter to maintain body temperature. Monitor body condition and adjust portions accordingly.

**Vitamin C**: Winter stress can increase vitamin C requirements. Ensure fresh vegetables high in vitamin C are provided daily.

**Fresh Water**: Check water bottles frequently to ensure they do not freeze in unheated areas.

**Health Monitoring**:

**Respiratory Issues**: Watch for signs of respiratory problems, which can be more common in winter due to poor ventilation or drafts.

**Skin and Coat**: Dry winter air can affect skin and coat condition. Ensure proper humidity levels and nutrition.

**Exercise**: Maintain regular exercise routines even when outdoor time is limited.',
  '2024-02-19',
  'https://images.pexels.com/photos/4588018/pexels-photo-4588018.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Education'
),
(
  'Farm Expansion: New Fowl Housing Facility',
  'Construction begins on our new state-of-the-art fowl housing facility, designed to accommodate our growing poultry breeding program.',
  'We are thrilled to announce the beginning of construction on our new fowl housing facility, a significant expansion that will allow us to grow our poultry breeding program while maintaining the highest standards of animal welfare.

**Facility Features**:

**Climate Control**: The new facility will feature advanced climate control systems to maintain optimal temperature and humidity levels year-round.

**Natural Lighting**: Large windows and skylights will provide natural lighting while LED systems ensure consistent day/night cycles.

**Flexible Housing**: Modular design allows for easy reconfiguration to accommodate different species and breeding groups.

**Biosecurity**: Enhanced biosecurity measures including controlled access, disinfection stations, and isolation areas for new arrivals.

**Outdoor Access**: Weather-protected outdoor runs will provide fresh air and natural foraging opportunities.

**Automated Systems**: Automated feeding and watering systems will ensure consistent care while reducing labor requirements.

**Breeding Program Expansion**:

The new facility will allow us to expand our heritage breed conservation efforts to include rare chicken breeds such as the Buckeye, Delaware, and Chantecler. We will also be able to offer a wider variety of ducks and geese.

**Educational Opportunities**: The facility is designed with educational tours in mind, featuring observation areas and informational displays about poultry husbandry and breed conservation.

Construction is expected to be completed by late spring, with the first birds moving in during early summer. This expansion represents our continued commitment to breed conservation and sustainable agriculture.',
  '2024-02-26',
  'https://images.pexels.com/photos/4588025/pexels-photo-4588025.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Updates'
);