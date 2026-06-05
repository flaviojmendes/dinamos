import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      command_center: {
        gui_name: 'DINAMOS GRAPHIC USER INTERFACE',
        open_access: 'OPEN ACCESS',
        operator_label: 'OPERATOR',
        access_label: 'ACCESS',
        system_label: 'SYSTEM',
        sync_label: 'SYNC',
        guest: 'GUEST',
        title: 'Command Center',
        session_active: 'SESSION ACTIVE',
        operator: 'Operator',
        readiness_suffix: '// mission readiness {{pct}}%',
        quick_jump: 'Quick Jump',
        metrics_title: 'Global Mission Metrics',
        modules_cleared: 'Modules Cleared',
        lessons_done: 'Lessons Done',
        readiness: 'Readiness',
        clearance: 'Clearance',
        stat_of: 'of {{count}}',
        operation_activity: 'Operation Activity',
        recommended_next: 'Recommended Next Op',
        deploy: 'Deploy',
        all_cleared: 'ALL OPERATIONS CLEARED',
        mission_table: 'Mission Table',
        col_operation: 'Operation',
        col_priority: 'Priority',
        col_progress: 'Progress',
        col_status: 'Status',
        activity_feed: 'Activity Feed',
        view_all: 'View All',
        no_transmissions: 'NO RECENT TRANSMISSIONS',
        replies: '{{count}} replies',
        search_placeholder: 'SEARCH OPERATIONS...',
        search_aria: 'Search lessons',
        no_matches: 'NO MATCHES',
        time_now: 'now',
        action_review: 'Review',
        action_resume: 'Resume',
        action_start: 'Start',
        tier: {
          foundational: 'FOUNDATIONAL',
          core: 'CORE',
          advanced: 'ADVANCED',
          applied: 'APPLIED',
        },
        modules: {
          fundamentals: 'Fundamentals',
          theory: 'Theoretical Foundations',
          components: 'System Components',
          design: 'Design Principles',
          consistency: 'Consistency Strategies',
          security: 'Security',
          monitoring: 'Monitoring & Maintenance',
          'ai-systems': 'AI & LLM Systems',
          'data-storage': 'Data & Storage',
          cases: 'Real-World Cases',
        },
      },
      quick_access: {
        title: 'QUICK ACCESS',
        command_center: 'Command Center',
        roadmap: 'Roadmap',
        editor: 'System Editor',
        forum: 'Forum',
        preferences: 'Preferences',
      },
      common: {
        start_now: 'Start Now',
        view_content: 'View Content',
        free_editor: 'Free Editor!',
        access_free_editor: 'Access the Distributed Systems Editor for free, no signup required!',
        new_offer: 'New Special Offer',
        final_cta_title: 'Ready to become an expert?',
        final_cta_subtitle: 'Join hundreds of developers mastering distributed systems in practice',
        guarantee_spot: 'Guarantee My Spot',
        loading: 'Loading roadmap...',
        discount_off: '{{percent}}% OFF',
        month: 'month',
        year: 'year'
      },
      footer: {
        all_rights_reserved: 'All rights reserved.',
        privacy_policy: 'Privacy Policy',
        terms: 'Terms of Service'
      },
      protected_route: {
        loading: 'Loading...',
        verifying_access: 'Verifying access...',
        attempt: 'Attempt {{attempt}}/{{total}}',
        access_denied: 'Access denied',
        redirecting: 'Redirecting...'
      },
      language_dialog: {
        title: 'Choose Your Language',
        detected_portuguese: 'We detected that your browser language is Portuguese. Would you like to continue in Portuguese?',
        detected_other: 'We detected that your browser language is English or another language. Would you like to continue in English?',
        continue_portuguese: 'Continue in Portuguese',
        continue_english: 'Continue in English',
        switch_english: 'Switch to English',
        switch_portuguese: 'Switch to Portuguese'
      },
      badges: {
        free: 'Free',
        new: 'New'
      },
      cookies: {
        banner: {
          title: 'We use cookies',
          description: 'We use cookies to enhance your experience, analyze site traffic, and provide personalized content. You can choose which cookies to accept.',
          accept: 'Accept All',
          reject: 'Reject All',
          customize: 'Customize'
        },
        preferences: {
          title: 'Cookie Preferences',
          save: 'Save Preferences',
          accept: 'Accept All',
          reject: 'Reject All'
        },
        necessary: {
          title: 'Necessary Cookies',
          description: 'Essential for basic website functionality, authentication, and security. Cannot be disabled.'
        },
        analytics: {
          title: 'Analytics Cookies',
          description: 'Help us understand how visitors interact with our website by collecting and reporting information anonymously.'
        },
        functional: {
          title: 'Functional Cookies',
          description: 'Enable enhanced functionality like remembering your preferences and providing personalized features.'
        },
        marketing: {
          title: 'Marketing Cookies',
          description: 'Track visitors across websites to display relevant and engaging advertisements.'
        },
        policy: {
          text: 'For more information, please read our',
          privacy: 'Privacy Policy',
          cookies: 'Cookie Policy'
        }
      },
      status: {
        recommended: 'Recommended',
        new: 'New',
        content: 'Content',
        coming_soon: 'Coming soon'
      },
      content: {
        mark_complete: 'Mark as completed',
        completed_label: 'Completed',
        reading_time: '{{minutes}} min read',
      },
      auth: {
        welcome_title: 'Welcome to System Design',
        welcome_subtitle: 'Sign in to access the full content and interactive simulators',
        login_google: 'Continue with Google',
        login_github: 'Continue with GitHub',
        terms_notice: 'By logging in, you agree to our terms of use and privacy policy.',
        error_google: 'Error logging in with Google. Please try again.',
        error_github: 'Error logging in with GitHub. Please try again.'
      },
      subscription: {
        title: 'Full Access',
        subtitle: 'Invest in your knowledge and professional development',
        limited_offer: 'Black November Special Offer (50% OFF)',
        one_time_lifetime: 'Monthly subscription - Full access',
        buy_now: 'Buy Now',
        processing: 'Processing...',
        error_processing: 'An error occurred while processing the payment. Please try again.',
        select_currency: 'Select your currency',
        coupon_code: 'Coupon Code (Optional)',
        enter_coupon: 'Enter coupon code',
        clear_coupon: 'Clear coupon',
        coupon_will_apply: 'Coupon "{{code}}" will be applied at checkout',
        coupon_invalid_format: 'Invalid coupon format. Use 3-20 characters (letters, numbers, - or _)',
        black_november_special: 'Black November Special Price! (50% OFF)',
        use_coupon_hint: 'Use BLACKNOVEMBER for 50% OFF!',
        features: [
          'Access to all interactive simulators',
          'Complete content on System Design',
          'Regular content updates',
          'Real-world practical examples',
          'Community support',
          'Full access to content'
        ],
        why_buy_title: 'Why buy?',
        why_practical_title: 'Hands-on Learning',
        why_practical_desc: 'Interactive simulators to experiment with real distributed systems scenarios, making it easier to understand complex concepts.',
        why_updated_title: 'Updated Content',
        why_updated_desc: 'Constantly updated material with the latest trends and best practices in systems architecture.',
        why_career_title: 'Professional Development',
        why_career_desc: 'Learn essential skills to advance your career as a software architect or engineer.',
        why_community_title: 'Community',
        why_community_desc: 'Join a community of developers, share experiences, and learn with other professionals.',
        payment_confirmed: 'Payment Confirmed!',
        access_granted_redirect: 'Your access has been granted successfully. Redirecting to the content...',
        monthly: 'Monthly',
        yearly: 'Yearly',
        one_time: 'One-time',
        monthly_plan: 'Monthly',
        yearly_plan: 'Yearly',
        lifetime_plan: 'Lifetime Access',
        billed_monthly: 'Billed monthly',
        best_value: 'BEST VALUE',
        save: 'Save',
        subscribe_now: 'Subscribe Now',
        cancel_anytime: 'Cancel anytime',
        lifetime_access_label: 'Acesso vitalício (Lifetime)',
        lifetime_description: 'Pay once and keep unlimited access forever.',
        pay_once: 'Pay once',
        get_lifetime_access: 'Get lifetime access',
        lifetime_note: 'One-time payment. Immediate lifetime access.',
        lifetime_unavailable: 'Lifetime pricing is not available for this currency yet.'
      },
      preferences: {
        title: 'Preferences',
        account_info: 'Account Information',
        email: 'Email',
        creation_date: 'Sign-up Date',
        manage_subscription: 'Manage Subscription',
        manage_subscription_desc: 'Manage your subscription, payment method, and invoice history through the Stripe portal.',
        privacy_cookies_title: 'Privacy & Cookies',
        cookie_preferences_title: 'Cookie Preferences',
        cookie_preferences_desc: 'Manage how we collect and use data on our website through cookies.',
        manage_cookies_btn: 'Manage Cookies',
        privacy_policy_title: 'Privacy Policy',
        privacy_policy_desc: 'Learn about how we collect, use, and protect your personal information.',
        view_policy_btn: 'View Policy',
        terms_title: 'Terms and Conditions',
        terms_desc: 'Review our terms of service and user agreement.',
        view_terms_btn: 'View Terms'
      },
      privacy_policy: {
        title: 'Privacy Policy',
        last_updated_label: 'Last updated:',
        last_updated_date: 'December 2024',
        sections: {
          info_collection: {
            title: '1. Information We Collect',
            description: 'We collect information you provide directly to us, such as when you:',
            items: [
              'Create an account or log in',
              'Subscribe to our services',
              'Contact us for support',
              'Participate in surveys or feedback'
            ]
          },
          use_info: {
            title: '2. How We Use Your Information',
            description: 'We use the information we collect to:',
            items: [
              'Provide, maintain, and improve our services',
              'Process transactions and send related information',
              'Send technical notices and support messages',
              'Respond to your comments and questions',
              'Analyze usage patterns to improve user experience'
            ]
          },
          sharing: {
            title: '3. Information Sharing',
            description: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.',
            items_title: 'We may share your information in the following situations:',
            items: [
              'With service providers who help us operate our services',
              'To comply with legal obligations',
              'To protect our rights and safety',
              'In connection with a business transfer'
            ]
          },
          security: {
            title: '4. Data Security',
            description: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
          },
          rights: {
            title: '5. Your Rights',
            description: 'Depending on your location, you may have certain rights regarding your personal information, including:',
            items: [
              'The right to access your personal information',
              'The right to correct or update your information',
              'The right to delete your information',
              'The right to restrict processing',
              'The right to data portability'
            ]
          },
          cookies: {
            title: '6. Cookies and Tracking',
            description: 'We use cookies and similar tracking technologies to enhance your experience. For detailed information about our use of cookies, please see our'
          },
          contact: {
            title: '7. Contact Us',
            description: 'If you have any questions about this Privacy Policy, please contact us:',
            items: [
              'Email: flavio@trilha.info',
              'Through our website contact form'
            ]
          }
        },
        links: {
          terms: 'Terms and Conditions',
          cookies: 'Cookie Policy',
          back_home: 'Back to Dinamos'
        }
      },
      terms: {
        title: 'Terms and Conditions',
        last_updated_label: 'Last updated:',
        last_updated_date: 'June 2026',
        sections: {
          acceptance: {
            title: '1. Acceptance of Terms',
            paragraphs: [
              'By accessing and using Dinamos ("the Service"), you accept and agree to be bound by these Terms. If you do not agree, please do not use the Service.',
              'We may change these Terms at any time. Continued use of the Service after changes means you accept the updated Terms.'
            ]
          },
          description: {
            title: '2. Description of Service',
            intro: 'Dinamos is an educational platform focused on distributed systems learning. Our service includes:',
            items: [
              'Interactive learning content and tutorials',
              'System design simulators and tools',
              'Educational materials and documentation',
              'Community features and progress tracking',
              'Premium subscription services'
            ]
          },
          accounts: {
            title: '3. User Accounts',
            intro: 'To access certain features, you must register for an account. You agree to:',
            items: [
              'Provide accurate and current information',
              'Keep your information up to date',
              'Maintain the security of your password and account',
              'Notify us of unauthorized use',
              'Accept responsibility for all activities under your account'
            ]
          },
          subscription: {
            title: '4. Subscription Services',
            intro: 'Some features require a paid subscription. By subscribing, you agree to:',
            items: [
              'Pay all applicable fees for your plan',
              'Automatic renewal unless cancelled before renewal',
              'Our refund policy as outlined in Section 5',
              'Fees are non-refundable except as required by law'
            ],
            note: 'We may change subscription pricing with reasonable notice to existing subscribers.'
          },
          cancellation: {
            title: '5. Cancellation and Refunds',
            intro: 'You may cancel anytime. After cancellation:',
            items: [
              'You keep access until the end of the billing period',
              'No partial refunds for unused time',
              'Your account reverts to the free tier after expiration'
            ],
            note: 'Refunds may be provided at our discretion in cases of unavailability or exceptional circumstances.'
          },
          ip_rights: {
            title: '6. Intellectual Property & Attribution',
            intro: 'All educational content on the Service is free to access, study, and share. We ask only one thing in return: always credit the platform. Whenever you use, reference, or reproduce our content — including in videos, courses, classes, presentations, articles, social media, or any other medium — you must:',
            items: [
              'Give clear and visible credit to Dinamos (trilhainfo) as the source of the content',
              'Include a link back to the platform (https://instagram.com/trilhainfo) whenever the medium allows it',
              'Keep any copyright, trademark, or authorship notices intact',
              'Not present our content as your own or imply official endorsement, partnership, or affiliation without permission'
            ]
          },
          conduct: {
            title: '7. User Conduct',
            intro: 'You agree not to use the Service to:',
            items: [
              'Violate any laws or regulations',
              'Transmit harmful, threatening, or offensive content',
              'Interfere with or disrupt the Service or servers',
              'Attempt unauthorized access to other accounts',
              'Share your account credentials with others',
              'Use automated systems to access the Service'
            ]
          },
          availability: {
            title: '8. Service Availability',
            intro: 'We strive for reliability but cannot guarantee uninterrupted availability. The Service may be unavailable due to:',
            items: [
              'Scheduled maintenance',
              'Technical difficulties',
              'Force majeure events',
              'Third-party service disruptions'
            ],
            note: 'We may modify, suspend, or discontinue the Service with reasonable notice.'
          },
          privacy: {
            title: '9. Privacy and Data Protection',
            paragraphs: [
              'Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated by reference.',
              'By using the Service, you consent to our data practices as described in the Privacy Policy.'
            ]
          },
          disclaimer: {
            title: '10. Disclaimer of Warranties',
            intro: 'The Service is provided "as is" and "as available" without warranties of any kind, including:',
            items: [
              'Merchantability or fitness for a particular purpose',
              'Non-infringement of third-party rights',
              'Accuracy, completeness, or reliability of content',
              'Uninterrupted or error-free operation'
            ]
          },
          liability: {
            title: '11. Limitation of Liability',
            intro: 'To the maximum extent permitted by law, Dinamos is not liable for indirect, incidental, special, consequential, or punitive damages, including:',
            items: [
              'Loss of profits, data, or other intangible losses',
              'Damages from use or inability to use the Service',
              'Damages from unauthorized access to your data'
            ],
            note: 'Total liability is limited to the amount you paid for the Service in the 12 months preceding the claim.'
          },
          indemnification: {
            title: '12. Indemnification',
            intro: 'You agree to indemnify and hold harmless Dinamos from claims, damages, losses, or expenses arising from:',
            items: [
              'Your use of the Service',
              'Your violation of these Terms',
              'Your violation of third-party rights',
              'Content you submit or share through the Service'
            ]
          },
          termination: {
            title: '13. Termination',
            intro: 'We may terminate or suspend your account and access immediately without notice for reasons including:',
            items: [
              'Breach of these Terms',
              'Fraudulent or illegal activity',
              'Extended inactivity'
            ],
            note: 'Upon termination, your right to use the Service ceases immediately; provisions on IP, disclaimers, and limitations survive.'
          },
          governing_law: {
            title: '14. Governing Law',
            paragraphs: [
              'These Terms are governed by the laws of Brazil, without regard to conflict of law provisions.',
              'Disputes are subject to the exclusive jurisdiction of the courts of Brazil.'
            ]
          },
          changes: {
            title: '15. Changes to Terms',
            intro: 'We may modify these Terms at any time. If we make material changes, we will notify you by:',
            items: [
              'Posting the updated Terms on this page',
              'Updating the "Last updated" date',
              'Sending notice via email or through the Service'
            ],
            note: 'Continued use after changes constitutes acceptance of the new Terms.'
          },
          contact: {
            title: '16. Contact Information',
            intro: 'If you have questions about these Terms, contact us:',
            items: [
              'Email: flavio@trilha.info',
              'Through our website contact form'
            ]
          },
          severability: {
            title: '17. Severability',
            paragraphs: [
              'If any provision is unenforceable or invalid, it will be limited or eliminated to the minimum extent necessary so the remaining Terms remain in full force and effect.'
            ]
          }
        },
        links: {
          privacy: 'Privacy Policy',
          cookies: 'Cookie Policy',
          back_home: 'Back to Dinamos'
        }
      },
      coupon_modal: {
        welcome_title: 'Welcome! 🎉',
        welcome_subtitle: 'Get exclusive access with our special Black November offer! (50% OFF)',
        coupon_code: 'Your exclusive coupon code:',
        discount_amount: '50% OFF - Valid All Black November! (50% OFF)',
        features_title: 'What you\'ll get:',
        feature_1: 'Complete systems design course',
        feature_2: 'Interactive simulators',
        feature_3: 'Real-world case studies',
        feature_4: 'Lifetime access',
        subscribe_now: 'Subscribe Now & Save 50%',
        maybe_later: 'Maybe later',
        timer_note: 'This offer is valid throughout the entire month of Black November! (50% OFF)'
      },
      landing: {
        hero_title: 'Master Distributed Systems in Practice',
        hero_subtitle: 'The most complete platform to learn system architecture with interactive simulators and real cases',
        features_title: 'Complete and Practical Content',
        features_subtitle: 'Everything you need to become a distributed systems expert',
        simulators_title: 'Learn with Interactive Simulators',
        simulators_subtitle: 'Visualize and experiment with complex concepts in real time',
        teacher_title: 'Who will teach you',
        teacher_experience_title: 'Experience',
        teacher_experience_item1: '15+ years of software development experience',
        teacher_experience_item2: 'Leadership roles at tech companies',
        teacher_experience_item3: 'Projects at global scale',
        teacher_specialties_title: 'Specialties',
        teacher_specialties_item1: 'Distributed Systems Architecture',
        teacher_specialties_item2: 'Scalability and Performance',
        teacher_specialties_item3: 'Security and Best Practices',
        teacher_about_me_text1: 'Hi! My name is Flávio, and I currently work as an Engineering Manager in Distributed Systems.',
        teacher_about_me_text2: 'In this material my intention is to put all these 16+ years of experience into practice, so that you leave here with the mindset that besides having technical repertoire, you need to get hands-on, experiment and validate your solutions.',
        teacher_about_me_text3: 'In my day-to-day I work on high performance, scalability and availability projects where we reach more than 1.5 billion requests per year.',

        fundamentals_title: 'Solid Fundamentals',
        fundamentals_item1: 'Distributed Systems 101',
        fundamentals_item2: 'System Design 101',
        fundamentals_item3: 'Basic Components',
        fundamentals_item4: 'Modern Architectures',

        real_cases_title: 'Real Cases',
        real_cases_item1: 'Netflix and YouTube',
        real_cases_item2: 'WhatsApp and Uber',
        real_cases_item3: 'Spotify and Bit.ly',
        real_cases_item4: 'Technical Decisions',

        simulators_item1: 'Cache Simulator',
        simulators_item1_description: 'Understand how cache works and how it improves systems performance',
        simulators_item2: 'Circuit Breaker',
        simulators_item2_description: 'Learn about fault tolerance and resilience in distributed systems',
        simulators_item3: 'Load Balancer',
        simulators_item3_description: 'Explore different load balancing strategies and their applications',
        simulators_item4: 'Security and Protection',

        journey_title: 'Your Learning Journey',
        journey_subtitle: 'A structured path to master distributed systems',
        journey_fundamentals_title: 'Fundamentals',
        journey_fundamentals_item1: 'Distributed Systems 101',
        journey_fundamentals_item2: 'System Design 101',
        journey_fundamentals_item3: 'Basic Components',
        journey_fundamentals_description: 'Learn the fundamental concepts and build a solid foundation for your journey',
        journey_design_principles_title: 'Design Principles',
        journey_design_principles_item1: 'Horizontal and Vertical Scalability',
        journey_design_principles_item2: 'High Availability',
        journey_design_principles_item3: 'Fault Tolerance',
        journey_design_principles_description: 'Master the essential principles of distributed systems design',
        journey_advanced_topics_title: 'Advanced Topics',
        journey_advanced_topics_item1: 'Consistency Strategies',
        journey_advanced_topics_item2: "Lamport's Logical Clocks",
        journey_advanced_topics_item3: 'Event-Driven Architecture',
        journey_advanced_topics_description: 'Explore advanced concepts and deepen your knowledge',
        journey_real_cases_title: 'Real Cases',
        journey_real_cases_item1: 'YouTube and Netflix',
        journey_real_cases_item2: 'Spotify and WhatsApp',
        journey_real_cases_item3: 'Uber and Bit.ly',
        journey_real_cases_description: 'Apply your knowledge by analyzing real success cases',

        invest_title: 'Invest in Your Future',
        invest_subtitle: 'Full access to all content with a monthly subscription',
        invest_payment_info: 'Monthly subscription - Full access',
        new_offer_badge: 'New Offer',
        what_you_receive_title: 'What You Get',
        what_you_receive_item1: 'Over 15 interactive simulators for hands-on practice',
        what_you_receive_item2: '6 detailed case studies of tech companies',
        what_you_receive_item3: 'Complete theoretical content with practical examples',
        what_you_receive_item4: 'Updates and new content included',
        differentials_title: 'Differentials',
        differentials_item1: 'Exclusive simulators to practice concepts',
        differentials_item2: 'Detailed analysis of real technical decisions',
        differentials_item3: 'Content in Portuguese focused on practice',
        differentials_item4: 'Structured learning roadmap',
        cta_title: 'Ready to become an expert?',
        cta_subtitle: 'Join hundreds of developers mastering distributed systems in practice',
        guarantee_spot: 'Guarantee My Spot',
        free_badge: 'FREE',
        free_title: 'Completely Free Access',
        free_subtitle: 'All content available at no cost. Learn distributed systems without any barriers.',
        free_price: 'FREE',
        free_description: 'Full access to all content, simulators, and real cases. No credit card required.',
        cta_free_title: 'Start Learning Today!',
        cta_free_subtitle: 'Full access to all content, 100% free. No subscription required.',
        forum_section: {
          title: 'Community Forum',
          subtitle: 'Latest discussions from the community',
          view_all: 'View all',
          see_more: '+{{count}} more topics'
        }
      },
      menu: {
        roadmap: {
          name: '🎯 Start Here',
          description: 'Your step-by-step learning journey'
        },
        intro: {
          name: 'Introduction',
          description: 'About the course and motivation'
        },
        sistemas_distribuidos_101: {
          name: 'Distributed Systems 101',
          description: 'Fundamental concepts through analogies'
        },
        system_design_101: {
          name: 'System Design 101',
          description: 'Fundamentals of system design'
        },
        theoretical_foundations: {
          name: 'Theoretical Foundations',
          description: 'Core distributed systems theory and principles',
          cap_theorem: {
            name: 'CAP Theorem',
            description: 'Consistency, Availability, and Partition tolerance trade-offs',
            title: 'CAP Theorem',
            subtitle: 'Understanding the fundamental trade-offs in distributed systems',
            introduction: 'Proposed by Eric Brewer in 2000, the CAP theorem is one of the most important concepts in distributed systems. It states that any distributed system can only guarantee two out of three properties: Consistency, Availability, and Partition tolerance. This theorem helps architects make informed decisions about system design trade-offs.',
            consistency: {
              title: 'Consistency',
              description: 'All nodes see the same data at the same time. Every read receives the most recent write or an error.',
              detailed_explanation: 'Consistency means that all nodes in the distributed system have the same view of the data at any given time. When a write operation completes successfully, all subsequent read operations will return the updated value until the data is changed again.',
              concrete_examples: [
                'Banking system: When you transfer $100 from Account A to Account B, all ATMs must show the correct balances immediately',
                'Social media: When you update your profile picture, all your friends must see the new picture, not a mix of old and new',
                'E-commerce: When an item goes out of stock, no customer should be able to purchase it from any server',
                'Gaming leaderboard: When a player achieves a high score, all players must see the updated rankings consistently'
              ],
              consistency_models: [
                'Strong Consistency: All reads receive the most recent write (PostgreSQL with synchronous replication)',
                'Eventual Consistency: System will become consistent over time (DNS propagation)',
                'Weak Consistency: No guarantees about when consistency will be achieved (live video streaming)'
              ]
            },
            availability: {
              title: 'Availability', 
              description: 'The system remains operational 100% of the time. Every request receives a response.',
              detailed_explanation: 'Availability means that the system continues to function and respond to requests even when some components fail. Every request receives a response (either success or failure) without guaranteeing that it contains the most recent version of the information.',
              concrete_examples: [
                'Netflix: Must keep streaming videos even if some servers are down, even if recommendations might be stale',
                'Amazon shopping: Website must stay accessible during peak shopping times, even if product details take time to sync',
                'WhatsApp: Messages must be deliverable even during network issues, messages can be delivered out of order',
                'Google Search: Must return results even if some data centers are unreachable, results might be slightly outdated'
              ],
              availability_metrics: [
                '99% uptime = 3.65 days downtime per year',
                '99.9% uptime = 8.76 hours downtime per year',
                '99.99% uptime = 52.56 minutes downtime per year',
                '99.999% uptime = 5.26 minutes downtime per year'
              ],
              strategies: [
                'Load balancing across multiple servers',
                'Redundant systems and failover mechanisms',
                'Graceful degradation of features',
                'Circuit breakers to prevent cascade failures'
              ]
            },
            partition_tolerance: {
              title: 'Partition Tolerance',
              description: 'The system continues to operate despite network failures between nodes.',
              detailed_explanation: 'Partition tolerance means the system continues to function even when network failures prevent some nodes from communicating with others. This is not optional in distributed systems - network failures are inevitable.',
              concrete_examples: [
                'Multi-region cloud: AWS East and West coast data centers lose connection but both continue serving users',
                'Mobile app: Your phone loses internet but cached data still works, syncs when connection returns',
                'Microservices: Payment service can\'t reach inventory service but can still process payments with cached data',
                'CDN: Local edge servers serve content even when disconnected from origin servers'
              ],
              partition_scenarios: [
                'Network cable gets cut between data centers',
                'Router/switch failures isolate server racks',
                'Internet provider outages affect regions',
                'DDoS attacks overwhelm network infrastructure',
                'Misconfigured firewalls block communication'
              ],
              handling_strategies: [
                'Detect partition events quickly',
                'Continue operating with available data',
                'Queue operations for later synchronization',
                'Implement conflict resolution mechanisms'
              ]
            },
            theorem_statement: 'The CAP Theorem States:',
            theorem_text: 'In the presence of a network partition, you must choose between consistency and availability',
            real_world_note: 'In practice, you don\'t choose between CAP properties for your entire system. Different parts of your application can make different trade-offs based on business requirements.',
            concrete_examples_title: 'Concrete Examples',
            consistency_examples_title: 'Consistency Examples',
            availability_examples_title: 'Availability Examples',
            partition_examples_title: 'Partition Tolerance Examples',
            characteristics_label: 'Characteristics:',
            examples_label: 'Examples:',
            use_cases_label: 'Use Cases:',
            limitations_label: 'Limitations:',
            cp_systems: {
              title: 'CP Systems (Consistency + Partition Tolerance)',
              description: 'Prioritize data consistency over availability during network partitions',
              characteristics: [
                'System becomes unavailable during partitions',
                'When available, data is always consistent',
                'Better for financial/critical data'
              ],
              examples: [
                'Traditional ACID databases (PostgreSQL, MySQL) with synchronous replication',
                'Apache HBase - ensures strong consistency',
                'MongoDB with strong consistency settings',
                'Zookeeper - coordination service requiring consensus',
                'Banking systems where accuracy > availability'
              ],
              use_cases: [
                'Financial transactions and banking',
                'Inventory management systems',
                'Configuration management',
                'Authentication and authorization systems'
              ]
            },
            ap_systems: {
              title: 'AP Systems (Availability + Partition Tolerance)', 
              description: 'Prioritize system availability over immediate consistency during partitions',
              characteristics: [
                'System remains available during partitions',
                'Data may be temporarily inconsistent',
                'Eventually becomes consistent when partition heals'
              ],
              examples: [
                'Amazon DynamoDB - highly available NoSQL database',
                'Apache Cassandra - distributed database prioritizing availability',
                'DNS system - must always resolve names, eventual consistency is OK',
                'Amazon S3 - object storage with eventual consistency',
                'Social media feeds - better to show slightly stale content than be unavailable'
              ],
              use_cases: [
                'Social media platforms',
                'Content delivery networks',
                'Shopping cart systems',
                'User preference storage',
                'Analytics and logging systems'
              ]
            },
            ca_systems: {
              title: 'CA Systems (Consistency + Availability)', 
              description: 'Traditional systems that sacrifice partition tolerance',
              characteristics: [
                'Perfect consistency and availability',
                'Only works in single location/no network partitions',
                'Not truly distributed systems'
              ],
              examples: [
                'Single-node databases (PostgreSQL, MySQL on one server)',
                'In-memory databases (Redis) on single machine',
                'Traditional RDBMS in single data center',
                'Legacy monolithic applications'
              ],
              limitations: [
                'Cannot handle network partitions',
                'Single point of failure',
                'Not suitable for geographically distributed systems',
                'Limited scalability'
              ],
              note: 'In practice, CA systems don\'t exist in truly distributed environments because network partitions are inevitable.'
            },
            practical_considerations: {
              title: 'Practical Considerations',
              points: [
                'Most modern systems are either CP or AP',
                'You can choose different trade-offs for different parts of your system',
                'Business requirements should drive your CAP decisions',
                'Monitor and measure actual consistency and availability',
                'Design for graceful degradation during partitions'
              ]
            },
            decision_framework: {
              title: 'How to Choose?',
              questions: [
                'Can your business tolerate temporary inconsistency?',
                'Is system availability more important than data accuracy?',
                'Are you operating across multiple geographic regions?',
                'What are the costs of downtime vs. inconsistent data?',
                'Can you implement conflict resolution mechanisms?'
              ]
            }
          },
          consistency_models: {
            name: 'Consistency Models',
            description: 'Strong, eventual, and weak consistency patterns',
            title: 'Consistency Models',
            subtitle: 'Different approaches to managing data consistency in distributed systems',
            introduction: 'Consistency models define the rules about when and how data updates become visible across a distributed system. Understanding these models is crucial for designing systems that balance data accuracy, performance, and availability according to your specific requirements.',
            strong_consistency: {
              title: 'Strong Consistency',
              description: 'All nodes see the same data at the same time. After a write operation, all subsequent reads will return the updated value.',
              detailed_explanation: 'Strong consistency guarantees that once a write operation completes successfully, all subsequent read operations will return the updated value from any node in the system. This provides the strongest guarantees but comes with performance and availability trade-offs.',
              characteristics: [
                'Immediate consistency across all nodes',
                'No stale data ever returned to clients',
                'ACID transaction guarantees',
                'Synchronous replication required',
                'Higher latency due to coordination overhead'
              ],
              concrete_examples: [
                'Bank account transfer: When you transfer money, both accounts must show correct balances immediately across all ATMs and branches',
                'Inventory management: When the last item is sold, no other customer should be able to purchase it from any location',
                'User authentication: Password changes must be effective immediately across all login servers',
                'Stock trading: Order execution must reflect immediately across all trading systems to prevent arbitrage'
              ],
              implementations: [
                'PostgreSQL with synchronous replication',
                'MongoDB with majority write concern',
                'Apache Zookeeper consensus protocol',
                'Google Spanner with TrueTime',
                'Traditional RDBMS with distributed transactions'
              ],
              use_cases: [
                'Financial transactions and banking systems',
                'Inventory and stock management',
                'User authentication and authorization',
                'Regulatory compliance systems',
                'Mission-critical enterprise applications'
              ],
              tradeoffs: 'Trade-offs: High consistency but may impact availability and performance'
            },
            eventual_consistency: {
              title: 'Eventual Consistency',
              description: 'The system will become consistent over time, given that the system doesn\'t receive new updates. Reads may return stale data temporarily.',
              detailed_explanation: 'Eventual consistency guarantees that if no new updates are made to a data item, eventually all accesses to that item will return the updated value. This model allows temporary inconsistencies but ensures high availability and partition tolerance.',
              characteristics: [
                'Temporary inconsistencies allowed',
                'High availability and partition tolerance',
                'Asynchronous replication',
                'Lower latency for write operations',
                'Conflict resolution mechanisms needed'
              ],
              concrete_examples: [
                'Social media timeline: Your post appears immediately for you but may take time to show up in friends\' feeds',
                'DNS propagation: Domain changes take time to propagate globally, different DNS servers may return different IPs temporarily',
                'Amazon product reviews: Reviews appear eventually on all servers, but immediate consistency isn\'t critical',
                'Email systems: Emails replicate to backup servers over time, temporary delays don\'t break functionality'
              ],
              implementations: [
                'Amazon DynamoDB with eventual consistency reads',
                'Apache Cassandra default consistency level',
                'Amazon S3 object storage',
                'DNS (Domain Name System)',
                'NoSQL databases with async replication'
              ],
              use_cases: [
                'Social media feeds and interactions',
                'Content management systems',
                'User preference storage',
                'Shopping cart systems',
                'Analytics and logging data'
              ],
              convergence_strategies: [
                'Last-write-wins (timestamp-based)',
                'Vector clocks for causality tracking',
                'Conflict-free replicated data types (CRDTs)',
                'Application-level conflict resolution',
                'Multi-version concurrency control'
              ],
              tradeoffs: 'Trade-offs: High availability and partition tolerance, but temporary inconsistency'
            },
            weak_consistency: {
              title: 'Weak Consistency',
              description: 'After a write, reads may or may not see the updated value. The system makes no guarantees about when data will be consistent.',
              detailed_explanation: 'Weak consistency makes no guarantees about when data will become consistent across nodes. This model prioritizes maximum performance and availability, accepting that data may be inconsistent for extended periods or even permanently in some cases.',
              characteristics: [
                'No consistency guarantees',
                'Maximum performance and throughput',
                'Best effort data propagation',
                'Minimal coordination overhead',
                'Application must handle inconsistencies'
              ],
              concrete_examples: [
                'Live video streaming: Frame drops or quality changes are acceptable for real-time performance',
                'Online gaming: Player positions may be slightly out of sync for better responsiveness',
                'Real-time collaboration: Cursor positions in shared documents don\'t need perfect consistency',
                'IoT sensor data: Occasional data loss is acceptable for high-frequency sensor readings'
              ],
              implementations: [
                'Memcached distributed caching',
                'Redis with no persistence',
                'UDP-based real-time systems',
                'Best-effort message queues',
                'Real-time streaming platforms'
              ],
              use_cases: [
                'Real-time gaming and simulations',
                'Live video/audio streaming',
                'High-frequency sensor data collection',
                'Real-time collaboration tools',
                'Performance monitoring and metrics'
              ],
              considerations: [
                'Application must be designed for inconsistency',
                'Data loss may be permanent',
                'Client-side conflict resolution often needed',
                'Suitable only for non-critical data',
                'Monitoring becomes crucial'
              ],
              tradeoffs: 'Trade-offs: Maximum performance and availability, minimal consistency guarantees'
            },
            choosing_title: 'Choosing the Right Model',
            use_cases: {
              strong: 'Financial transactions, inventory systems, user authentication',
              eventual: 'Social media feeds, comments, user profiles, shopping carts',
              weak: 'Live video streaming, online gaming, real-time collaboration'
            },
            decision_matrix: {
              title: 'Decision Matrix',
              factors: [
                'Data criticality: How important is data accuracy?',
                'Performance requirements: What latency is acceptable?',
                'Availability needs: Can the system tolerate downtime?',
                'Scale requirements: How many concurrent users?',
                'Geographic distribution: Multiple regions or data centers?'
              ]
            },
            practical_guidelines: {
              title: 'Practical Implementation Guidelines',
              tips: [
                'Different parts of your system can use different consistency models',
                'Start with strong consistency and relax only where necessary',
                'Monitor consistency metrics in production',
                'Design conflict resolution strategies upfront',
                'Consider hybrid approaches for complex applications'
              ]
            },
            examples_title: 'Real-World Examples',
            characteristics_label: 'Characteristics:',
            examples_label: 'Examples:',
            implementations_label: 'Implementations:',
            use_cases_label: 'Use Cases:',
            convergence_label: 'Convergence Strategies:',
            considerations_label: 'Considerations:'
          },
          distributed_challenges: {
            name: 'Distributed Challenges',
            description: 'Common problems in distributed systems',
            title: 'Distributed Systems Challenges',
            subtitle: 'Common problems and complexities in distributed computing',
            introduction: 'Distributed systems face unique challenges that don\'t exist in single-machine systems. Understanding these fundamental problems is crucial for designing resilient, scalable, and reliable distributed applications. Each challenge requires careful consideration and specific solutions.',
            network_partitions: {
              title: 'Network Partitions',
              description: 'Network failures that split the system into isolated groups, forcing trade-offs between consistency and availability.',
              detailed_explanation: 'Network partitions occur when network failures prevent some nodes from communicating with others, effectively splitting the system into isolated groups. This is one of the most challenging problems in distributed systems because it forces immediate decisions about consistency vs. availability.',
              characteristics: [
                'Communication failure between nodes',
                'System splits into isolated islands',
                'Immediate CAP theorem trade-offs required',
                'Can be temporary or permanent',
                'Affects data consistency guarantees'
              ],
              concrete_examples: [
                'Data center connectivity: Cable cut between AWS regions causes 6-hour partition, each region must decide whether to stay online',
                'Microservices: Payment service can\'t reach inventory service, must decide whether to process orders with stale inventory data',
                'Database cluster: Master-slave replication breaks, slaves must decide whether to accept writes or remain read-only',
                'CDN network: Internet routing issues isolate edge servers from origin, cached content becomes stale but users still served'
              ],
              causes: [
                'Physical network failures (cable cuts, router failures)',
                'Software bugs in networking stack',
                'Overloaded network infrastructure',
                'Security incidents (DDoS attacks)',
                'Configuration errors in routing'
              ],
              detection_strategies: [
                'Heartbeat mechanisms between nodes',
                'Timeout-based failure detection',
                'Gossip protocols for membership',
                'External monitoring systems',
                'Network-level health checks'
              ],
              mitigation_approaches: [
                'Multiple network paths and redundancy',
                'Graceful degradation strategies',
                'Circuit breakers for failing services',
                'Read-only mode during partitions',
                'Conflict resolution for partition healing'
              ],
              impact: 'Impact: Loss of communication between nodes, potential data inconsistency'
            },
            clock_sync: {
              title: 'Clock Synchronization',
              description: 'Different nodes have different clocks, making it difficult to order events and maintain consistency.',
              detailed_explanation: 'Clock synchronization is fundamental to distributed systems because nodes have independent clocks that drift at different rates. Without synchronized time, it becomes nearly impossible to order events, maintain causality, or implement time-based algorithms correctly.',
              characteristics: [
                'Clocks drift at different rates',
                'No global notion of "now"',
                'Event ordering becomes ambiguous',
                'Impacts timestamps and logs',
                'Critical for distributed algorithms'
              ],
              concrete_examples: [
                'Banking transactions: Transfer appears to complete before it started due to clock skew, causing audit failures',
                'Distributed logging: Error logs appear out of order across services, making debugging impossible',
                'Cache invalidation: TTL expires at different times on different nodes, causing stale data',
                'Lease management: Distributed locks expire at different times, leading to split-brain scenarios'
              ],
              problems_caused: [
                'Incorrect event ordering in logs',
                'Race conditions in time-based logic',
                'Inconsistent cache expiration',
                'Distributed lock failures',
                'Audit trail corruption'
              ],
              sync_approaches: [
                'Network Time Protocol (NTP)',
                'Precision Time Protocol (PTP)',
                'GPS-based time synchronization',
                'Atomic clock references',
                'Google TrueTime API'
              ],
              logical_alternatives: [
                'Lamport timestamps for causality',
                'Vector clocks for partial ordering',
                'Hybrid logical clocks (HLC)',
                'Event-based ordering instead of time',
                'Consensus-based sequence numbers'
              ],
              solutions: 'Solutions: Logical clocks, Vector clocks, NTP'
            },
            partial_failures: {
              title: 'Partial Failures',
              description: 'Some parts of the system fail while others continue working, creating inconsistent states.',
              detailed_explanation: 'Partial failures are perhaps the most insidious challenge in distributed systems. Unlike complete system failures that are obvious, partial failures create scenarios where some components work while others fail, leading to inconsistent states that are difficult to detect and handle.',
              characteristics: [
                'Only subset of system components fail',
                'Difficult to detect and diagnose',
                'Can cause cascading failures',
                'System appears partially functional',
                'Creates inconsistent global state'
              ],
              concrete_examples: [
                'E-commerce checkout: Payment processed but inventory not updated due to database failure, overselling occurs',
                'Email system: Message delivered to some recipients but not others due to server failures',
                'Social media: Post visible to some users but not others due to replication lag',
                'File storage: Data written to primary but replication to backups fails, data loss risk increases'
              ],
              failure_types: [
                'Fail-stop: Component stops completely',
                'Fail-slow: Component responds very slowly',
                'Byzantine: Component behaves arbitrarily',
                'Omission: Component drops some messages',
                'Commission: Component sends wrong data'
              ],
              detection_challenges: [
                'No clear failure signal',
                'Timeouts are ambiguous',
                'Network vs. node failures unclear',
                'Silent data corruption possible',
                'Partial state updates'
              ],
              handling_strategies: [
                'Comprehensive health checks',
                'Circuit breaker pattern',
                'Graceful degradation',
                'Compensation transactions',
                'Idempotent operations'
              ],
              challenges: 'Challenges: Detecting failures, handling timeouts, recovery strategies'
            },
            consensus: {
              title: 'Consensus',
              description: 'Getting distributed nodes to agree on a single value or decision in the presence of failures.',
              detailed_explanation: 'Consensus is the problem of getting multiple distributed nodes to agree on a single value, even when some nodes may fail or behave maliciously. This is fundamental to many distributed systems operations like leader election, configuration management, and ensuring consistency.',
              characteristics: [
                'All correct nodes must agree',
                'Must handle node failures',
                'Must terminate in finite time',
                'Safety and liveness guarantees',
                'Foundation for many distributed protocols'
              ],
              concrete_examples: [
                'Database cluster: Nodes must agree on which transactions to commit in what order',
                'Kubernetes cluster: Nodes must agree on which pods are running where',
                'Blockchain: Miners must agree on the next block in the chain',
                'Configuration management: Services must agree on current configuration version'
              ],
              problem_variants: [
                'Byzantine fault tolerance: Handle malicious nodes',
                'Crash fault tolerance: Handle only crash failures',
                'Leader election: Choose single coordinator',
                'Atomic broadcast: Order all messages',
                'State machine replication: Keep replicas synchronized'
              ],
              famous_algorithms: [
                'Paxos: Classic consensus with strong guarantees',
                'Raft: Simpler alternative to Paxos',
                'PBFT: Byzantine fault tolerant consensus',
                'FLP impossibility: Theoretical limitations',
                'RAFT: Leader-based consensus for log replication'
              ],
              real_world_usage: [
                'Apache Zookeeper uses Zab protocol',
                'etcd and Consul use Raft',
                'Google Spanner uses Paxos',
                'Blockchain networks use Proof of Work/Stake',
                'Database replication protocols'
              ],
              algorithms: 'Algorithms: Raft, PBFT, Paxos'
            },
            state_management: {
              title: 'State Management',
              description: 'Keeping track of system state across multiple nodes while handling concurrent updates.',
              detailed_explanation: 'State management in distributed systems involves maintaining consistent state across multiple nodes while handling concurrent updates, failures, and network partitions. This challenge becomes exponentially more complex as the number of nodes and the frequency of updates increase.',
              characteristics: [
                'State distributed across nodes',
                'Concurrent updates from multiple sources',
                'Must handle node failures gracefully',
                'Consistency vs. performance trade-offs',
                'Requires coordination mechanisms'
              ],
              concrete_examples: [
                'Shopping cart: User adds items from mobile app while simultaneously from web, both updates must be preserved',
                'Multiplayer game: Player position updates from multiple clients must be reconciled in real-time',
                'Collaborative document: Multiple users editing same document simultaneously',
                'Inventory system: Multiple warehouses updating stock levels concurrently'
              ],
              consistency_challenges: [
                'Read-after-write consistency',
                'Monotonic read consistency',
                'Session consistency',
                'Eventual consistency guarantees',
                'Strong consistency requirements'
              ],
              concurrency_issues: [
                'Lost updates problem',
                'Dirty reads from uncommitted data',
                'Non-repeatable reads',
                'Phantom reads in range queries',
                'Write-write conflicts'
              ],
              architectural_patterns: [
                'Event sourcing: Store events, not state',
                'CQRS: Separate command and query models',
                'Saga pattern: Manage distributed transactions',
                'Two-phase commit: Ensure atomicity',
                'Compensation-based transactions'
              ],
              approaches: 'Approaches: Event sourcing, CQRS, distributed state machines'
            },
            race_conditions: {
              title: 'Race Conditions',
              description: 'Multiple processes accessing shared resources simultaneously, leading to unpredictable results.',
              detailed_explanation: 'Race conditions in distributed systems occur when multiple processes or nodes attempt to access and modify shared resources simultaneously, leading to unpredictable and often incorrect results. Unlike single-machine race conditions, distributed race conditions are harder to detect and debug.',
              characteristics: [
                'Non-deterministic execution order',
                'Shared resource contention',
                'Timing-dependent bugs',
                'Difficult to reproduce',
                'Can cause data corruption'
              ],
              concrete_examples: [
                'Bank account: Two ATMs withdraw simultaneously, both check balance ($100), both allow $60 withdrawal, account goes negative',
                'Ticket booking: Two customers book last seat simultaneously, both get confirmation, airplane oversold',
                'Counter increment: Multiple services increment global counter, final value incorrect due to lost updates',
                'Resource allocation: Two processes allocate same server resources, causing resource conflicts'
              ],
              common_scenarios: [
                'Check-then-act operations',
                'Read-modify-write cycles',
                'Double-checked locking patterns',
                'Initialization race conditions',
                'Cleanup race conditions'
              ],
              distributed_complications: [
                'Network delays mask timing issues',
                'Partial failures during operations',
                'Clock synchronization problems',
                'Message reordering effects',
                'Distributed lock failures'
              ],
              prevention_techniques: [
                'Atomic operations and Compare-And-Swap',
                'Distributed locking mechanisms',
                'Message ordering guarantees',
                'Optimistic concurrency control',
                'Pessimistic locking strategies'
              ],
              solutions: 'Solutions: Locks, atomic operations, message ordering'
            },
            fallacies_title: 'The Fallacies of Distributed Computing',
            fallacies: {
              f1: 'The network is reliable',
              f2: 'Latency is zero',
              f3: 'Bandwidth is infinite',
              f4: 'The network is secure',
              f5: 'Topology doesn\'t change',
              f6: 'There is one administrator',
              f7: 'Transport cost is zero',
              f8: 'The network is homogeneous'
            },
            fallacies_warning: 'These false assumptions lead to many distributed systems problems',
            fallacies_explanation: 'The Eight Fallacies of Distributed Computing, identified by Peter Deutsch and others, represent common misconceptions that developers make when designing distributed systems. Understanding these fallacies is crucial for building robust distributed applications.',
            mitigation_strategies: {
              title: 'General Mitigation Strategies',
              strategies: [
                'Design for failure: Assume components will fail',
                'Implement comprehensive monitoring and alerting',
                'Use circuit breakers to prevent cascade failures',
                'Build in graceful degradation capabilities',
                'Test failure scenarios regularly (chaos engineering)',
                'Implement proper logging and distributed tracing',
                'Use idempotent operations where possible',
                'Design for eventual consistency when appropriate'
              ]
            },
            characteristics_label: 'Characteristics:',
            examples_label: 'Examples:',
            causes_label: 'Common Causes:',
            detection_label: 'Detection Strategies:',
            mitigation_label: 'Mitigation Approaches:',
            problems_label: 'Problems Caused:',
            approaches_label: 'Approaches:',
            algorithms_label: 'Algorithms:',
            usage_label: 'Real-World Usage:',
            patterns_label: 'Architectural Patterns:',
            techniques_label: 'Prevention Techniques:',
            scenarios_label: 'Common Scenarios:',
            complications_label: 'Distributed Complications:',
            sync_approaches_label: 'Synchronization Approaches:',
            logical_alternatives_label: 'Logical Alternatives:',
            failure_types_label: 'Failure Types:',
            detection_challenges_label: 'Detection Challenges:',
            handling_strategies_label: 'Handling Strategies:',
            problem_variants_label: 'Problem Variants:',
            consistency_challenges_label: 'Consistency Challenges:',
            concurrency_issues_label: 'Concurrency Issues:'
          },
          network_partitions: {
            name: 'Network Partitions & Failures',
            description: 'Handling network splits and node failures',
            title: 'Network Partitions & Failures',
            subtitle: 'Understanding and handling network splits and node failures in distributed systems',
            introduction: 'Network partitions are one of the most fundamental and challenging problems in distributed systems. When network failures prevent nodes from communicating, systems must make critical decisions about consistency versus availability. Understanding how to detect, prevent, and handle partitions is essential for building resilient distributed applications.',
            what_is: {
              title: 'What is a Network Partition?',
              description: 'A network partition occurs when the network between nodes fails, splitting the system into isolated groups that cannot communicate with each other.',
              detailed_explanation: 'Network partitions represent a failure mode where the distributed system becomes divided into isolated islands of nodes that can communicate internally but not across the partition boundary. This is particularly challenging because each partition may continue operating independently, potentially making conflicting decisions.',
              note: 'Also known as a "split-brain" scenario, where different parts of the system may make independent decisions, potentially leading to inconsistency.',
              characteristics: [
                'Communication between node groups is impossible',
                'Each partition can make independent decisions',
                'CAP theorem trade-offs become immediately relevant',
                'System state can diverge across partitions',
                'Recovery requires conflict resolution strategies'
              ]
            },
            causes: {
              title: 'Causes of Partitions',
              description: 'Network partitions can arise from various infrastructure and configuration issues that affect connectivity between distributed nodes.',
              items: [
                'Router or switch failures',
                'Cable cuts or damage', 
                'ISP or datacenter outages',
                'Software bugs in network stack',
                'Misconfigured firewalls'
              ],
              detailed_causes: [
                'Physical infrastructure failures: Cable cuts, router hardware failures, power outages affecting network equipment',
                'Software bugs: Network stack bugs, driver issues, routing protocol failures, DNS resolution problems',
                'Configuration errors: Firewall misconfigurations, routing table errors, security policy conflicts',
                'Overload conditions: Network congestion, DDoS attacks, resource exhaustion causing packet drops',
                'Environmental factors: Natural disasters, construction accidents, electromagnetic interference'
              ]
            },
            failure_types: {
              title: 'Types of Failures',
              description: 'Different failure modes require different detection and handling strategies in distributed systems.',
              fail_stop: {
                title: 'Fail-Stop',
                description: 'Node stops completely and other nodes can detect the failure',
                detailed_explanation: 'In fail-stop failures, a node completely ceases operation and stops responding to all requests. This is the easiest type of failure to detect and handle because the failure is clean and observable by other nodes.',
                characteristics: [
                  'Node stops responding completely',
                  'Easy to detect with timeouts',
                  'No risk of partial state corruption',
                  'Clean failure semantics'
                ],
                examples: [
                  'Server power failure causing immediate shutdown',
                  'Process crash due to out-of-memory condition',
                  'Network interface failure making node unreachable',
                  'Container or VM termination'
                ]
              },
              fail_slow: {
                title: 'Fail-Slow', 
                description: 'Node becomes very slow but doesn\'t crash completely',
                detailed_explanation: 'Fail-slow failures are particularly insidious because the node continues to operate but with severely degraded performance. This can cause timeouts, cascading failures, and make it difficult to distinguish between network latency and node problems.',
                characteristics: [
                  'Node responds but very slowly',
                  'Difficult to distinguish from network latency',
                  'Can cause cascading performance issues',
                  'May lead to resource exhaustion in other nodes'
                ],
                examples: [
                  'CPU overload causing request processing delays',
                  'Memory pressure leading to excessive garbage collection',
                  'Disk I/O bottlenecks slowing down operations',
                  'Network congestion causing intermittent delays'
                ]
              },
              byzantine: {
                title: 'Byzantine',
                description: 'Node behaves arbitrarily or maliciously',
                detailed_explanation: 'Byzantine failures represent the most complex failure mode where nodes may send conflicting, corrupted, or malicious messages. These failures require sophisticated consensus algorithms and are especially important in adversarial environments.',
                characteristics: [
                  'Node sends incorrect or conflicting messages',
                  'May appear to work correctly to some nodes',
                  'Requires majority agreement to handle',
                  'Most difficult type of failure to detect and handle'
                ],
                examples: [
                  'Memory corruption causing incorrect computations',
                  'Software bugs leading to inconsistent responses',
                  'Malicious attacks attempting to compromise consensus',
                  'Clock skew causing timestamp inconsistencies'
                ]
              }
            },
            concrete_examples: {
              title: 'Real-World Partition Scenarios',
              examples: [
                'AWS region isolation: Inter-region network failure isolates US-East from US-West, each region continues serving traffic independently',
                'Database cluster split: Master-slave replication breaks, slaves must decide whether to accept writes or remain read-only to prevent conflicts',
                'Microservices partition: Payment service loses connection to inventory service during checkout, must decide whether to process orders with stale inventory data',
                'CDN edge isolation: Internet routing issues isolate edge servers from origin, cached content becomes stale but users continue to be served',
                'Kubernetes cluster partition: Worker nodes lose connection to master, pods continue running but new deployments fail'
              ]
            },
            partition_scenarios: {
              title: 'Common Partition Scenarios',
              datacenter_split: {
                title: 'Multi-Datacenter Partitions',
                description: 'When datacenters lose connectivity, each must decide how to handle ongoing operations',
                strategies: [
                  'Designate primary datacenter for writes',
                  'Switch to read-only mode in secondary datacenters',
                  'Use consensus to elect new primary',
                  'Implement conflict-free data structures'
                ]
              },
              service_mesh_partition: {
                title: 'Service Mesh Partitions',
                description: 'When services in a mesh lose connectivity to subsets of other services',
                strategies: [
                  'Circuit breaker pattern to fail fast',
                  'Fallback to cached responses',
                  'Graceful degradation of functionality',
                  'Queue requests for later processing'
                ]
              },
              database_partition: {
                title: 'Database Cluster Partitions',
                description: 'When database nodes become isolated from each other',
                strategies: [
                  'Use quorum-based writes to maintain consistency',
                  'Switch minority partitions to read-only mode',
                  'Implement last-write-wins conflict resolution',
                  'Use vector clocks for causality tracking'
                ]
              }
            },
            handling_title: 'Handling Strategies',
            detection: {
              title: 'Detection',
              description: 'Early and accurate detection of network partitions is crucial for implementing appropriate response strategies.',
              items: [
                'Heartbeat mechanisms',
                'Timeout-based detection',
                'Gossip protocols',
                'External monitoring'
              ],
              detailed_strategies: [
                'Heartbeat mechanisms: Regular ping/pong messages between nodes to detect connectivity loss',
                'Timeout-based detection: Set reasonable timeouts to distinguish slow responses from failures',
                'Gossip protocols: Distributed failure detection where nodes share information about other nodes',
                'External monitoring: Third-party services to validate connectivity from multiple perspectives',
                'Application-level probes: Health checks specific to business logic functionality'
              ],
              challenges: [
                'Distinguishing between network delays and actual partitions',
                'False positives due to temporary network congestion',
                'Setting appropriate timeout values for different scenarios',
                'Handling partial connectivity (some nodes reachable, others not)'
              ]
            },
            prevention: {
              title: 'Prevention',
              description: 'While partitions cannot be completely prevented, their likelihood and impact can be significantly reduced through proper infrastructure design.',
              items: [
                'Redundant network paths',
                'Multiple datacenters',
                'Quality network equipment',
                'Regular maintenance'
              ],
              detailed_strategies: [
                'Network redundancy: Multiple independent network paths, diverse ISPs, redundant routers and switches',
                'Geographic distribution: Multi-region deployments, availability zones, edge locations',
                'Infrastructure quality: Enterprise-grade networking equipment, proper capacity planning, regular hardware refresh',
                'Operational excellence: Scheduled maintenance windows, change management processes, monitoring and alerting',
                'Chaos engineering: Regularly testing partition scenarios to validate system behavior'
              ]
            },
            recovery: {
              title: 'Recovery',
              description: 'When partitions heal, systems must carefully reconcile state and resolve any conflicts that occurred during the partition.',
              items: [
                'Automatic failover',
                'Data reconciliation', 
                'Split-brain resolution',
                'Graceful degradation'
              ],
              detailed_strategies: [
                'Conflict detection: Identify divergent state changes that occurred during the partition',
                'Merge strategies: Implement application-specific logic to resolve conflicts automatically',
                'Manual intervention: Provide tools for operators to resolve complex conflicts manually',
                'Compensation transactions: Implement undo operations for conflicting state changes',
                'Version vectors: Use logical timestamps to establish causality and conflict resolution order'
              ]
            },
            design_principles: {
              title: 'Design Principles for Partition Tolerance',
              architectural: {
                title: 'Architectural Patterns',
                items: [
                  'Use consensus algorithms (Raft, Paxos)',
                  'Implement quorum-based decisions',
                  'Design for eventual consistency',
                  'Use circuit breakers and bulkheads'
                ],
                detailed_patterns: [
                  'Consensus algorithms: Raft, Paxos, PBFT for maintaining agreement across partitions',
                  'Quorum systems: Majority-based decision making to ensure consistency during partitions',
                  'Event sourcing: Immutable event logs that can be merged when partitions heal',
                  'CQRS: Separate read and write models to handle partition scenarios differently',
                  'Saga pattern: Long-running transactions with compensation for distributed consistency'
                ]
              },
              operational: {
                title: 'Operational Practices',
                items: [
                  'Regular disaster recovery testing',
                  'Monitoring and alerting systems',
                  'Automated deployment and scaling',
                  'Documentation and runbooks'
                ],
                detailed_practices: [
                  'Chaos engineering: Regularly induce partitions to test system behavior',
                  'Game day exercises: Practice partition scenarios with entire teams',
                  'Automated testing: Include partition testing in CI/CD pipelines',
                  'Monitoring dashboards: Real-time visibility into partition detection and recovery',
                  'Runbook procedures: Step-by-step guides for handling partition scenarios'
                ]
              }
            },
            cap_theorem_connection: {
              title: 'Connection to CAP Theorem',
              explanation: 'Network partitions force immediate CAP theorem trade-offs between consistency and availability',
              trade_offs: [
                'Choose Consistency: Reject operations to maintain data consistency, sacrificing availability',
                'Choose Availability: Continue operations with potentially stale data, sacrificing consistency',
                'Hybrid approach: Different services may make different trade-offs based on business requirements'
              ]
            },
            best_practices: {
              title: 'Best Practices',
              practices: [
                'Design for partition tolerance from the beginning',
                'Implement comprehensive monitoring and alerting',
                'Test partition scenarios regularly through chaos engineering',
                'Document decision-making processes for partition handling',
                'Train operations teams on partition response procedures',
                'Use proven consensus algorithms rather than building custom solutions',
                'Implement graceful degradation rather than complete service failure',
                'Monitor business metrics during partition scenarios'
              ]
            },
            characteristics_label: 'Characteristics:',
            examples_label: 'Examples:',
            causes_label: 'Detailed Causes:',
            strategies_label: 'Strategies:',
            challenges_label: 'Challenges:',
            patterns_label: 'Detailed Patterns:',
            practices_label: 'Detailed Practices:'
          }
        },
        
        componentes: {
          name: 'Basic Components',
          description: 'Fundamental building blocks of distributed systems',
          banco_dados: {
            name: 'Databases',
            description: 'Data storage and management'
          },
          cache: {
            name: 'Cache',
            description: 'Temporary storage for better performance',
            simulator: {
              name: 'Simulator',
              description: 'Experiment with different cache strategies'
            }
          },
          load_balancer: {
            name: 'Load Balancer',
            description: 'Traffic distribution across servers',
            simulator: {
              name: 'Simulator',
              description: 'Experiment with different balancing algorithms'
            }
          },
          message_queue: {
            name: 'Message Queues',
            description: 'Asynchronous communication between services',
            simulator: {
              name: 'Simulator',
              description: 'Experiment with message flow'
            }
          },
          cdn: {
            name: 'CDN',
            description: 'Global content distribution',
            simulator: {
              name: 'Simulator',
              description: 'See how CDN accelerates delivery'
            }
          },
          api_gateway: {
            name: 'API Gateway',
            description: 'Single entry point for APIs',
            simulator: {
              name: 'Simulator',
              description: 'Experiment with API routing and protection'
            }
          },
          firewall: {
            name: 'Firewall',
            description: 'Security and traffic control',
            simulator: {
              name: 'Simulator',
              description: 'Experiment with firewall rules'
            }
          },
          polling_webhooks: {
            name: 'Polling vs Webhooks',
            description: 'Real-time communication strategies',
            teoria: {
              name: 'Theory and Concepts',
              description: 'Fundamentals and detailed comparison'
            },
            simulator: {
              name: 'Interactive Simulator',
              description: 'See the difference in practice'
            }
          },
          vector_database: {
            name: 'Vector Database',
            description: 'Store embeddings and run similarity search'
          },
          model_gateway: {
            name: 'Model Gateway',
            description: 'Infrastructure that fronts your LLMs'
          },
          kafka: {
            name: 'Kafka & Streaming',
            description: 'Partitioned, replayable event logs and consumer groups',
            simulator: {
              name: 'Kafka Simulator',
              description: 'Tune partitions and consumers and watch consumer lag'
            }
          },
          dns: {
            name: 'DNS',
            description: 'The distributed phone book that resolves names to addresses'
          },
          reverse_proxy: {
            name: 'Reverse Proxy',
            description: 'A front door that terminates TLS, routes, and caches'
          },
          service_discovery: {
            name: 'Service Discovery',
            description: 'How services find each other in a dynamic fleet'
          },
          service_mesh: {
            name: 'Service Mesh',
            description: 'Sidecar proxies for traffic, security, and observability'
          },
          kubernetes: {
            name: 'Kubernetes',
            description: 'Declarative orchestration of containers at scale'
          }
        },
        principios_design: {
          name: 'Design Principles',
          description: 'Essential concepts for robust systems',
          escalabilidade: {
            name: 'Scalability',
            description: 'System growth and adaptation',
            horizontal: {
              name: 'Horizontal (Scale Out)',
              description: 'Adding more machines',
              simulator: {
                name: 'Simulator',
                description: 'Experiment with horizontal scalability'
              }
            },
            vertical: {
              name: 'Vertical (Scale Up)',
              description: 'Increasing machine resources',
              simulator: {
                name: 'Simulator',
                description: 'Experiment with vertical scalability'
              }
            },
            latencia: {
              name: 'Latency',
              description: 'Measuring and optimizing latency'
            },
            failover: {
              name: 'Failover',
              description: 'Automatic failure recovery'
            },
            simulator: {
              name: 'Complete Simulator',
              description: 'Compare different scaling strategies'
            }
          },
          disponibilidade: {
            name: 'High Availability',
            description: 'Keeping the system always running',
            replicacao: {
              name: 'Replication',
              description: 'Synchronized data copies'
            },
            failover: {
              name: 'Failover',
              description: 'Automatic failure recovery'
            },
            zonas: {
              name: 'Availability Zones',
              description: 'Geographic distribution for resilience'
            },
            'disaster-recovery': {
              name: 'Disaster Recovery',
              description: 'Catastrophic failure recovery strategies'
            },
            monitoramento: {
              name: 'Health Monitoring',
              description: 'Continuous system health tracking'
            },
            'distribuicao-carga': {
              name: 'Load Distribution',
              description: 'Traffic distribution across servers'
            },
            simulator: {
              name: 'Simulator',
              description: 'Experiment with availability strategies'
            }
          },
          tolerancia_falhas: {
            name: 'Fault Tolerance',
            description: 'Dealing with system failures',
            retries: {
              name: 'Retries',
              description: 'Automatic retry attempts',
              simulator: {
                name: 'Simulator',
                description: 'Experiment with different retry strategies'
              }
            },
            circuit_breaker: {
              name: 'Circuit Breaker',
              description: 'Preventing cascading failures',
              simulator: {
                name: 'Simulator',
                description: 'See circuit breaker in action'
              }
            },
            timeout: {
              name: 'Timeout',
              description: 'Limiting wait time',
              simulator: {
                name: 'Simulator',
                description: 'Experiment with different timeout configurations'
              }
            }
          },
          eventos: {
            name: 'Event-Driven Architecture',
            description: 'Event-based systems',
            simulator: {
              name: 'Simulator',
              description: 'Experiment with event sourcing and event-driven'
            }
          },
          servicos: {
            name: 'Service Architecture',
            description: 'Monolith vs Microservices'
          },
          acoplamento: {
            name: 'Coupling',
            description: 'Dynamic and static coupling between services'
          },
          orquestracao_vs_coreografia: {
            name: 'Orchestration vs Choreography',
            description: 'Compare orchestration and choreography patterns'
          },
          cqrs: {
            name: 'CQRS',
            description: 'Separate write and read models via an event log',
            simulator: {
              name: 'CQRS Simulator',
              description: 'Issue commands and watch read models catch up'
            }
          },
          rate_limiting: {
            name: 'Rate Limiting',
            description: 'Token bucket, leaky bucket, and sliding window',
            simulator: {
              name: 'Rate Limiter Simulator',
              description: 'Compare algorithms and watch accepted vs rejected'
            }
          },
          backpressure: {
            name: 'Backpressure',
            description: 'Flow control when consumers can\'t keep up',
            simulator: {
              name: 'Backpressure Simulator',
              description: 'Throttle a producer when the queue fills up'
            }
          }
        },
        estrategias_de_consistencia: {
          name: 'Consistency Strategies',
          description: 'How to ensure consistency in distributed systems',
          sincronizacao: {
            name: 'Synchronization',
            description: 'Coordination and synchronization in distributed systems',
            fundamentos: {
              name: 'Fundamentals',
              description: 'Basic synchronization concepts using Dining Philosophers'
            },
            deadlocks: {
              name: 'Deadlocks',
              description: 'Prevention and detection of deadlocks in Philosophers context'
            },
            algoritmos: {
              name: 'Algorithms',
              description: 'Distributed algorithms for coordination'
            }
          },
          two_phase_commit: {
            name: 'Two Phase Commit',
            description: 'Consensus protocol for distributed transactions',
            simulador: {
              name: 'Simulator',
              description: 'Interactive simulation of Two Phase Commit protocol'
            }
          },
          consenso: {
            name: 'Consensus Strategy',
            description: 'Protocols and mechanisms to ensure agreement between nodes',
            simulador: {
              name: 'Simulator',
              description: 'Interactive simulation of consensus protocols'
            }
          },
          lamport_timestamps: {
            name: 'Lamport Logical Clocks',
            description: 'Event ordering in distributed systems',
            simulador: {
              name: 'Simulator',
              description: 'Visualize event ordering with Lamport timestamps'
            }
          },
          saga: {
            name: 'Saga Pattern',
            description: 'Long-running transactions with compensating actions',
            simulator: {
              name: 'Saga Simulator',
              description: 'Run a saga, inject a failure, and watch it roll back'
            }
          },
          delivery_semantics: {
            name: 'Delivery Semantics',
            description: 'At-most-once, at-least-once, and exactly-once',
            simulator: {
              name: 'Delivery Semantics Simulator',
              description: 'Toggle dedup and DLQ to control duplicates and loss'
            }
          },
          vector_clocks: {
            name: 'Vector Clocks',
            description: 'Track causality and detect concurrent updates'
          }
        },
        monitoramento_e_manutencao: {
          name: 'Monitoring and Maintenance',
          description: 'Monitoring and maintenance of distributed systems',
          metricas: {
            name: 'Metrics and KPIs',
            description: 'Essential indicators for monitoring'
          },
          logs: {
            name: 'Logs and Tracing',
            description: 'Tracking and analysis of distributed logs',
            simulador: {
              name: 'Log Simulator',
              description: 'Experiment with good and bad log examples'
            },
            tracing: {
              name: 'Tracing Simulator',
              description: 'Experiment with event tracing'
            }
          },
          alertas: {
            name: 'Alerts and Notifications',
            description: 'Alert configuration and management'
          },
          performance: {
            name: 'Performance Analysis',
            description: 'Identification and resolution of bottlenecks'
          },
          health_checks: {
            name: 'Health Checks',
            description: 'Service health monitoring'
          },
          llm_observability: {
            name: 'LLM Observability',
            description: 'Tokens, cost, traces, and quality evaluations'
          },
          distributed_tracing: {
            name: 'Distributed Tracing',
            description: 'Follow a request across services with spans and context'
          },
          slo_sli_sla: {
            name: 'SLO, SLI & Error Budgets',
            description: 'Measure reliability and spend it with burn rate'
          }
        },
        casos_reais: {
          name: 'Real Cases',
          description: 'Real system design examples from major companies',
          youtube: {
            name: 'YouTube',
            description: 'How YouTube processes and distributes videos globally'
          },
          spotify: {
            name: 'Spotify',
            description: 'Real-time music streaming architecture'
          },
          bitly: {
            name: 'Bit.ly',
            description: 'URL shortening service design at scale'
          },
          whatsapp: {
            name: 'WhatsApp',
            description: 'Real-time messaging system'
          },
          netflix: {
            name: 'Netflix',
            description: 'Video streaming and content recommendation'
          },
          uber: {
            name: 'Uber',
            description: 'Real-time geolocation and matching system'
          },
          chatgpt: {
            name: 'ChatGPT',
            description: 'Serving LLMs to hundreds of millions with streaming'
          },
          perplexity: {
            name: 'Perplexity',
            description: 'RAG-based answer engine with cited sources'
          },
          github_copilot: {
            name: 'GitHub Copilot',
            description: 'Low-latency inline code completion at scale'
          }
        },
        seguranca: {
          name: 'Security',
          description: 'Protection and security in distributed systems',
          autenticacao: {
            name: 'Authentication',
            description: 'Identity verification in distributed systems'
          },
          autorizacao: {
            name: 'Authorization',
            description: 'Access control and permissions'
          },
          criptografia: {
            name: 'Cryptography',
            description: 'Data protection in transit and at rest',
            simulador: {
              name: 'Simulator',
              description: 'Experiment with different types of cryptography in practice'
            }
          },
          tokens: {
            name: 'Tokens and JWT',
            description: 'Session management and access tokens',
            simulador: {
              name: 'Simulator',
              description: 'Experiment with JWT generation and validation'
            }
          },
          ssl_tls: {
            name: 'SSL/TLS',
            description: 'Secure communication between systems'
          },
          ataques: {
            name: 'Common Attacks',
            description: 'Prevention against attacks in distributed systems'
          },
          prompt_injection: {
            name: 'Prompt Injection',
            description: 'LLM-specific attacks and guardrails',
            simulador: {
              name: 'Prompt Injection Simulator',
              description: 'Stack defenses and watch whether the secret leaks'
            }
          }
        },
        ai_systems: {
          name: 'AI & LLM Systems',
          description: 'Serving LLMs, RAG, vector search, and agents at scale',
          llm_serving_fundamentals: {
            name: 'LLM Serving Fundamentals',
            description: 'Tokens, context windows, prefill vs decode, and the KV cache',
            simulator: {
              name: 'Inference Batching Simulator',
              description: 'See how batching trades throughput against latency'
            }
          },
          rag: {
            name: 'RAG Architecture',
            description: 'Ground answers in your own data with retrieval',
            simulator: {
              name: 'RAG Pipeline Simulator',
              description: 'Tune chunking, retrieval, and reranking end to end'
            }
          },
          vector_search: {
            name: 'Vector Search',
            description: 'Approximate nearest-neighbor search at scale',
            simulator: {
              name: 'Vector Search Simulator',
              description: 'Trade recall against latency with HNSW parameters'
            }
          },
          llm_gateway: {
            name: 'LLM Gateway',
            description: 'Routing, semantic caching, fallback, and cost control',
            simulator: {
              name: 'LLM Gateway Simulator',
              description: 'Route requests with caching, fallback, and rate limits'
            }
          },
          gpu_autoscaling: {
            name: 'GPU Serving & Autoscaling',
            description: 'Cold starts, queueing, and scale-to-zero for GPUs',
            simulator: {
              name: 'GPU Autoscaler Simulator',
              description: 'Balance cost against latency under bursty load'
            }
          },
          agentic: {
            name: 'Agentic Systems',
            description: 'Tool calling and multi-step orchestration',
            simulator: {
              name: 'Agent Orchestration Simulator',
              description: 'Watch an agent loop call tools, retry, and branch'
            }
          }
        },
        data_storage: {
          name: 'Data & Storage',
          description: 'Partitioning, replication, and finding data at scale',
          consistent_hashing: {
            name: 'Consistent Hashing',
            description: 'Place keys on a ring so topology changes move few keys',
            simulator: {
              name: 'Consistent Hashing Simulator',
              description: 'Add and remove nodes and watch keys remap'
            }
          },
          sharding: {
            name: 'Sharding & Partitioning',
            description: 'Split data by range, hash, or directory — and avoid hotspots',
            simulator: {
              name: 'Sharding Simulator',
              description: 'Stream keys into shards and watch hot shards emerge'
            }
          },
          object_storage: {
            name: 'Object & Blob Storage',
            description: 'Durable, cheap blob storage at massive scale (S3)'
          },
          distributed_file_systems: {
            name: 'Distributed File Systems',
            description: 'GFS/HDFS: chunked, replicated files across a cluster'
          },
          inverted_index: {
            name: 'Search & Inverted Index',
            description: 'The data structure behind full-text search',
            simulator: {
              name: 'Inverted Index Simulator',
              description: 'Query terms and watch documents rank by score'
            }
          }
        },
        editor: {
          name: 'System Editor',
          description: 'Create and simulate distributed systems'
        },
        forum: {
          name: 'Community Forum',
          description: 'Discuss and learn with the community'
        },
        design_lab: {
          name: 'Design Lab',
          description: 'Access our design lab'
        }
      },
      skills: {
        consensus: 'Consensus',
        lamport_timestamps: 'Lamport Timestamps',
        eventual_consistency: 'Eventual Consistency',
        synchronization: 'Synchronization',
        mutual_exclusion: 'Mutual Exclusion',
        deadlock_prevention: 'Deadlock Prevention',
        distributed_synchronization: 'Distributed Synchronization',
        race_conditions: 'Race Conditions',
        shared_resources: 'Shared Resources',
        deadlock_detection: 'Deadlock Detection',
        prevention: 'Prevention',
        recovery: 'Recovery',
        bakery_algorithm: 'Bakery Algorithm',
        token_ring: 'Token Ring',
        ricart_agrawala: 'Ricart-Agrawala',
        two_phase_commit: '2PC',
        distributed_transactions: 'Distributed Transactions',
        atomic_consensus: 'Atomic Consensus',
        visualization: 'Visualization',
        experimentation: 'Experimentation',
        solution_analysis: 'Solution Analysis'
      },
      prerequisites: {
        design_principles: 'Design Principles'
      },
      categories: {
        basic: 'Basic',
        intermediate: 'Intermediate',
        advanced: 'Advanced'
      },
      roadmap: {
        title: 'Learning Roadmap',
        description_1: 'Follow this structured guide to master distributed systems concepts.',
        description_2: 'The roadmap is organized into a logical learning sequence, with clear prerequisites and skills to be developed in each step.',
        free: 'Free',
        premium: 'Premium',
        in_dev: 'In development',
        modules: 'modules',
        completed: 'Completed',
        in_progress: 'In progress',
        not_started: 'Not started',
        start_module: 'Start module',
        resume_module: 'Resume module',
        review_module: 'Review module',
        prerequisites: 'Prerequisites:',
        skills: 'Skills:',
        completed_percent: '{{percent}}% of content completed',
        ops_map: 'OPS MAP',
        phase: 'Phase',
        lessons: 'lessons',
        modules_cleared: 'Modules cleared',
        lessons_done: 'Lessons done',
        readiness: 'Readiness',
        total_phases: 'Phases',
        of_count: 'of {{count}}'
      },
      editor: {
        title: 'Distributed System Simulator',
        buttons: {
          start: 'Run',
          stop: 'Pause',
          step: 'Step',
          reset: 'Reset',
          export: 'Export (.din)',
          import: 'Import (.din)',
          remove_edge: 'Remove Connection'
        },
        kinds: {
          client: 'Client',
          loadBalancer: 'Load Balancer',
          apiGateway: 'API Gateway',
          cache: 'Cache',
          server: 'Server',
          database: 'Database',
          replicatedDb: 'Replicated DB',
          shardRouter: 'Shard Router',
          messageQueue: 'Message Queue',
          circuitBreaker: 'Circuit Breaker',
          autoScaler: 'Auto-Scaler',
          externalDependency: 'External Dependency'
        },
        engine_tagline: 'SIMULATION ENGINE V2',
        how_to_use: 'How to use',
        menu: {
          edit: 'Edit settings',
          duplicate: 'Duplicate',
          disconnect: 'Disconnect edges',
          kill: 'Kill node (chaos)',
          delete: 'Delete',
          delete_edge: 'Delete connection'
        },
        descriptions: {
          client: 'Generates the offered load (requests/s) that drives the whole system. Connect its output to your first tier (API gateway, load balancer or server). Tune "Base rate" to set how many requests per second enter the system.',
          loadBalancer: 'Spreads incoming requests across the downstream replicas it points to, using the selected strategy (round-robin, least-connections, weighted or consistent hashing). Place it between the client/gateway and a pool of servers.',
          apiGateway: 'Single entry point at the edge of your system. Enforces a requests/s rate limit — traffic above the limit is dropped — and forwards the rest to backends. Connect the client to it, and it to your services.',
          cache: 'Serves a fraction of reads from memory set by "Hit rate". Hits return quickly; misses fall through to the downstream store. Put it in front of a database or service to cut load and latency.',
          server: 'Stateless compute tier that processes requests with a given service time and concurrency. Scale it with replicas or front it with an auto-scaler. Connect it to databases, caches or other services it depends on.',
          database: 'Persistent datastore and an end point (no outgoing edges). Its service time and concurrency make it a common bottleneck. Send read/write traffic from servers into it.',
          replicatedDb: 'Database with multiple replicas. Writes (set by "Write fraction") hit the primary; reads spread across replicas. Pick a consistency level (strong/quorum/eventual) and replication lag to model trade-offs.',
          shardRouter: 'Partitions traffic across shards by key using hash or range strategy. "Hot-shard skew" models one shard receiving disproportionate load. Connect it to a pool of shard backends.',
          messageQueue: 'Buffers incoming requests and drains them at a fixed rate to smooth spikes. Messages beyond the queue capacity are dropped. Place it between a fast producer and a slower consumer.',
          circuitBreaker: 'Wraps a downstream dependency. When the error rate exceeds the threshold it opens and sheds load for the reset timeout, then half-opens to probe recovery. Use it to stop cascading failures.',
          autoScaler: 'Adjusts the replica count of the tier it fronts to keep utilization near the target, bounded by min/max replicas. Use it to react automatically to changing load.',
          externalDependency: 'A third-party service you do not control (an end point). Model its latency and failure rate to simulate outages or slowdowns of upstream providers.'
        },
        hints: {
          label: 'Display name for this node on the canvas. Does not affect the simulation.',
          base_rate: 'Requests per second this client generates. Higher = more load on the whole system; lower = lighter traffic.',
          service_time: 'Milliseconds to process one request (sets the service rate µ). Higher = slower per request, lower capacity and higher latency; lower = faster and more throughput.',
          concurrency: 'Parallel workers per replica (the c in M/M/c). Higher = more requests served at once, less queueing and lower latency; lower = saturates sooner.',
          replicas: 'Number of identical copies of this node (horizontal scaling). Higher = proportionally more capacity; lower = less capacity.',
          failure_rate: 'Baseline probability a request fails here regardless of load. Higher = more errors propagated downstream; lower = more reliable.',
          timeout: 'Milliseconds before a slow request is counted as failed. Lower = more timeouts when the node is busy; higher = waits longer before giving up.',
          max_retries: 'How many times a failed call is retried. Higher = fewer final errors but more amplified load (retry storms); lower = less load but more user-visible failures.',
          distribution: 'Shape of the per-request latency distribution. Lognormal has a realistic heavy tail, exponential is memoryless, deterministic is constant.',
          variability: 'Coefficient of variation of latency (lognormal only). Higher = heavier tail, so p95/p99 grow; lower = more uniform latencies.',
          strategy: 'How incoming requests are spread across downstream replicas (round-robin, least-connections, weighted, or consistent hashing).',
          rate_limit: 'Maximum requests per second admitted; anything above is dropped. Higher = fewer drops but more load downstream; lower = protects backends but rejects traffic.',
          hit_rate: 'Fraction of reads served from cache. Higher = much less load and latency downstream; lower = more requests fall through to the store.',
          ttl: 'How long cached entries stay valid. Higher = more hits but staler data; lower = fresher data but more misses.',
          queue_capacity: 'Maximum messages buffered. Higher = absorbs bigger spikes without dropping, but adds backlog latency; lower = drops sooner under overload.',
          drain_rate: 'Messages consumed per second. Higher = backlog clears faster and latency drops; lower = backlog builds up.',
          write_fraction: 'Share of operations that are writes. Higher = more load on the single primary (writes serialize), lowering effective capacity; lower = reads dominate and scale across replicas.',
          replication_lag: 'Milliseconds replicas trail the primary. Higher = more stale reads with eventual consistency; lower = fresher replicas.',
          consistency: 'Read/write guarantee. Strong is safest but slowest, quorum balances, eventual is fastest but can read stale data.',
          shard_count: 'Number of partitions traffic is split across. Higher = more parallel capacity; lower = each shard carries more load.',
          skew: 'How unevenly load lands on the hottest shard. Higher = one shard saturates and caps effective capacity; lower = balanced load.',
          shard_strategy: 'How keys map to shards. Hash spreads evenly; range keeps neighbouring keys together (more prone to hotspots).',
          error_threshold: 'Downstream error rate that trips the breaker open. Lower = opens sooner to protect the dependency; higher = tolerates more errors first.',
          reset_timeout: 'Milliseconds the breaker stays open before probing recovery. Higher = waits longer before retrying; lower = retries the dependency sooner.',
          target_utilization: 'Utilization the auto-scaler tries to hold. Lower = scales out earlier (more replicas, more headroom); higher = runs hotter with fewer replicas.',
          min_replicas: 'Lower bound on replicas the auto-scaler will keep, even when idle.',
          max_replicas: 'Upper bound on replicas the auto-scaler can add under load.'
        },
        inspector: {
          title: 'Inspector',
          empty: 'Select a node to edit its configuration.',
          label: 'Label',
          base_rate: 'Base rate',
          service_time: 'Service time',
          concurrency: 'Concurrency (c)',
          replicas: 'Replicas',
          capacity_approx: 'capacity ≈ {{value}}',
          reliability: 'Reliability',
          failure_rate: 'Failure rate',
          timeout: 'Timeout',
          max_retries: 'Max retries',
          latency_shape: 'Latency shape',
          distribution: 'Distribution',
          variability: 'Variability (CV)',
          strategy: 'Strategy',
          rate_limit: 'Rate limit',
          hit_rate: 'Hit rate',
          ttl: 'TTL',
          queue_capacity: 'Queue capacity',
          drain_rate: 'Drain rate',
          write_fraction: 'Write fraction',
          replication_lag: 'Replication lag',
          consistency: 'Consistency',
          shard_count: 'Shard count',
          skew: 'Hot-shard skew',
          error_threshold: 'Error threshold',
          reset_timeout: 'Reset timeout',
          target_utilization: 'Target utilization',
          min_replicas: 'Min replicas',
          max_replicas: 'Max replicas',
          dist: { lognormal: 'Lognormal', exponential: 'Exponential', deterministic: 'Deterministic' },
          strat: { roundRobin: 'Round Robin', leastConnections: 'Least Connections', weighted: 'Weighted', hashing: 'Consistent Hashing' },
          cons: { strong: 'Strong', quorum: 'Quorum', eventual: 'Eventual' },
          shard_strat: { hash: 'Hash', range: 'Range' }
        },
        dashboard: {
          offered: 'Offered',
          throughput: 'Throughput',
          success: 'Success',
          p95: 'p95',
          in_flight: 'In-flight',
          cost: '{{provider}} cost',
          error_budget: 'Error budget used (SLO {{slo}}%)',
          chart_throughput: 'Throughput vs Offered (req/s)',
          chart_latency: 'Latency percentiles (ms)',
          chart_success: 'Success rate (%) & in-flight',
          accumulated_cost: 'Accumulated cost this run:'
        },
        scenario: {
          preset: 'Preset',
          load_profile: 'Load profile',
          cloud: 'Cloud',
          chaos: 'Chaos',
          load: 'Load',
          inject: 'Inject',
          profiles: { constant: 'Constant', ramp: 'Ramp', spike: 'Spike', diurnal: 'Diurnal', step: 'Step' },
          chaos_types: { killNode: 'Kill node', latencyInjection: 'Inject latency', partition: 'Partition' },
          presets: {
            'three-tier': 'Three-Tier Web App',
            'read-heavy-cache': 'Read-Heavy + Cache',
            'event-driven': 'Event-Driven + Queue',
            'sharded-store': 'Sharded Datastore',
            'microservice-mesh': 'Microservice Mesh'
          }
        },
        node: {
          in: 'in',
          out: 'out',
          p95: 'p95',
          fail_s: 'fail/s',
          retry_s: 'retry/s',
          idle: 'idle',
          hit_s: 'hit/s',
          miss_s: 'miss/s',
          hit_rate: 'hit rate',
          queue: 'queue',
          dropped_s: 'dropped/s',
          breaker: 'breaker',
          replicas: 'replicas',
          shards: 'shards',
          consistency: 'consistency',
          writes: 'writes',
          reads: 'reads',
          replica_set: 'replica set',
          primary: 'primary',
          replica: 'replica'
        },
        warnings: {
          NO_CLIENT: 'No client node in the design',
          NOT_CONVERGED: 'Simulation did not converge',
          BOTTLENECK: 'Bottleneck: {{name}}',
          DISCONNECTED: 'Disconnected: {{name}}',
          ZERO_CAPACITY: 'Zero capacity: {{name}}'
        },
        labels: {
          client_rps: 'Client Requests/s:',
          load_status: 'Load Status:',
          normal: 'Normal (<60%)',
          warning: 'Warning (60-80%)',
          critical: 'Critical (>80%)',
          components: 'Components',
          cloud: 'Cloud:',
          speed: 'Speed',
          seed: 'Seed',
          monthly_cost_estimate: 'Monthly Cost Estimate ({{provider}})',
          note_prefix: '* Estimate based on public {{provider}} prices (2024), simplified for simulation.',
          total: 'Total'
        },
        metrics: {
          requests_per_second: 'Requests/s',
          error_rate: 'Error Rate',
          response_time_ms: 'Response',
          active_connections: 'Active Connections',
          connections_limit: 'Connection Limit:',
          connections: 'connections',
          algorithm: 'Algorithm:',
          random: 'Random',
          least_connections: 'Least Connections',
          processing_time_ms: 'Processing Time (ms):',
          queue: 'Queue',
          enqueued_per_s: 'Enqueued/s',
          dequeued_per_s: 'Dequeued/s',
          dropped_per_s: 'Dropped/s',
          latency_ms: 'Latency',
          hit_rate: 'Hit Rate',
          hits_per_s: 'Hits/s',
          misses_per_s: 'Misses/s',
          failures_per_s: 'Failures/s',
          queue_capacity: 'Queue Capacity:',
          dequeue_msgs_per_s: 'Dequeue (msgs/s):',
          throughput_reqs: 'Throughput (req/s):',
          failure_rate_percent: 'Failure Rate (%):',
          rate_limit_reqs: 'Rate Limit (req/s):',
          total_latency_ms: 'Total Latency',
          throttled_per_s: 'Throttled/s:'
        },
        components: {
          client: 'Client',
          server: 'Server', 
          database: 'Database',
          load_balancer: 'Load Balancer',
          api_gateway: 'API Gateway',
          cache: 'Cache',
          message_queue: 'Message Queue'
        },
        node_labels: {
          client: 'Client',
          server: 'Server',
          database: 'Database', 
          load_balancer: 'Load Balancer',
          api_gateway: 'API Gateway',
          cache: 'Cache',
          message_queue: 'Message Queue'
        },
        cache_metrics: {
          requests_per_second: 'Requests/s',
          response_time: 'Response',
          total_latency: 'Total Latency',
          hits_per_second: 'Hits/s',
          misses_per_second: 'Misses/s',
          hit_rate: 'Hit Rate',
          failures_per_second: 'Failures/s'
        },
        queue_metrics: {
          queue: 'Queue',
          enqueued_per_second: 'Enqueued/s',
          dequeued_per_second: 'Dequeued/s',
          dropped_per_second: 'Dropped/s',
          latency: 'Latency'
        },
        errors: {
          invalid_file: 'Invalid or corrupted file',
          import_error: 'Error importing file. Invalid or corrupted format.',
          read_error: 'Error reading file. Please try again.'
        },
        dev_page: {
          title: 'Page in Development',
          description: 'This is a preview of the Systems Editor under development. Soon, you will be able to create and simulate complete distributed architectures with more components, metrics, and features. Stay tuned for updates!',
          note: 'Note: The calculations and metrics shown in this version are approximations and may not accurately reflect the behavior of a real system. We are working to improve the accuracy of the simulations.'
        }
      },
      forum: {
        title: 'Community Forum',
        subtitle: 'Discuss, ask questions, and learn with the community',
        new_topic: 'New Topic',
        category: 'Category',
        title_field: 'Title',
        title_placeholder: 'What do you want to discuss?',
        content: 'Content',
        content_placeholder: 'Describe your question or topic in detail...',
        markdown_supported: 'Markdown is supported',
        cancel: 'Cancel',
        post: 'Post',
        posting: 'Posting...',
        by: 'by',
        all: 'All',
        replies: 'Replies',
        reply: 'Reply',
        comments_count: '{{count}} comments',
        comments_count_one: '{{count}} comment',
        no_comments: 'No comments yet',
        reply_placeholder: 'Write your reply...',
        nested_reply_placeholder: 'Write your reply to this message...',
        replying_to: 'Replying to:',
        delete: 'Delete',
        delete_topic: 'Delete topic',
        confirm_delete_message: 'Are you sure you want to delete this message?',
        confirm_delete_topic: 'Are you sure you want to delete this topic? This action cannot be undone.',
        back_to_topics: 'Back to topics',
        no_topics: 'No topics yet',
        be_first: 'Be the first to start a discussion!',
        no_replies: 'No replies yet. Be the first to respond!',
        try_again: 'Try again',
        subscription_required: 'Subscription Required',
        subscription_message: 'The community forum is available exclusively for subscribers. Join now to participate in discussions and learn with the community!',
        subscribe_now: 'Subscribe Now',
        login_required: 'Login Required',
        login_message: 'Please sign in to access the community forum.',
        subscribe_to_post: 'Subscribe to post',
        subscribe_to_reply: 'Subscribe to join the discussion and reply to topics.',
        sort: {
          recent: 'Most recent',
          active: 'Most active',
          popular: 'Most popular',
          oldest: 'Oldest first',
          newest: 'Newest first',
          top: 'Most voted'
        },
        time: {
          just_now: 'just now',
          minutes_ago: '{{count}}m ago',
          hours_ago: '{{count}}h ago',
          days_ago: '{{count}}d ago'
        }
      },
      challenges: {
        title: 'System Design Challenges',
        subtitle: 'Practice your skills with real-world distributed systems problems',
        view_all: 'View All',
        start_challenge: 'Start Challenge',
        attempt: 'attempt',
        attempts: 'attempts',
        has_video: 'Has video solution',
        cta_title: 'Ready to test your knowledge?',
        cta_description: 'Access the Design Lab to practice system design with AI feedback.',
        go_to_lab: 'Go to Design Lab'
      },
      theoretical_foundations_main: {
        subtitle: 'Building unshakeable knowledge for distributed systems',
        hero: {
            title: 'Why Theory Matters in Practice',
            description: 'In the fast-paced world of today, it might seem tempting to jump straight into implementation. However, without solid theoretical foundations, even the most experienced engineers can make costly mistakes that could have been avoided with proper understanding of fundamental principles.'
          },
          paragraph1: 'Understanding theoretical foundations in distributed systems is not an academic luxury—it\'s a practical necessity. Just as a skyscraper requires a solid foundation to withstand earthquakes and storms, distributed systems require theoretical understanding to handle the inevitable challenges of network failures, data inconsistencies, and scalability pressures. Engineers who master these concepts don\'t just build systems; they build systems that last, scale, and adapt to changing requirements.',
          paragraph2: 'Consider the consequences of building without theory: teams that implement caching without understanding consistency models often create systems where users see their own updates disappear intermittently. Developers who don\'t grasp the CAP theorem might architect systems that promise both perfect consistency and 100% availability, only to discover during critical moments that such guarantees are mathematically impossible in the presence of network partitions.',
          paragraph3: 'The CAP theorem, one of our foundational topics, provides crucial decision-making framework for system architects. It\'s not just about knowing that you can\'t have consistency, availability, and partition tolerance simultaneously—it\'s about understanding what this means for your specific use case. Should your e-commerce platform prioritize showing consistent prices (consistency) or ensure the site stays online during network issues (availability)? The answer depends on business requirements, but the framework for making this decision comes from understanding the theoretical implications.',
          paragraph4: 'Consistency models form another pillar of theoretical knowledge that directly impacts practical implementation. When Netflix decides to use eventual consistency for user recommendation updates but strong consistency for billing information, they\'re applying theoretical knowledge to solve real business problems. Understanding when to apply strong, eventual, or weak consistency isn\'t intuitive—it requires grasping the trade-offs between performance, availability, and data accuracy.',
          paragraph5: 'The theoretical understanding of trade-offs extends far beyond academic interest—it directly translates to business value. Engineers who understand these concepts can make informed decisions about technology choices, avoiding costly rewrites and performance issues. They can estimate the true cost of consistency guarantees, predict how systems will behave under load, and design architectures that gracefully handle failure scenarios.',
          paragraph6: 'Theoretical foundations also serve as a shield against common pitfalls that plague distributed systems. The "8 Fallacies of Distributed Computing" aren\'t just historical curiosities—they\'re practical warnings about assumptions that continue to trip up modern development teams. Understanding that "the network is reliable" is false helps engineers design systems with proper retry mechanisms, circuit breakers, and graceful degradation strategies.',
          paragraph7: 'From a collaboration perspective, theoretical knowledge provides a common language for technical discussions. When architects discuss whether to implement read replicas, conversations become more productive when everyone understands concepts like read consistency, lag tolerance, and split-brain scenarios. Theory provides the vocabulary for precise technical communication, reducing misunderstandings that lead to architectural misalignments.',
          paragraph8: 'These foundations also provide a systematic approach to problem-solving. When a production system exhibits strange behavior—users in different regions seeing different data, or performance degrading under specific conditions—engineers with theoretical grounding can quickly narrow down root causes. They understand the relationship between network topology, consistency guarantees, and performance characteristics, enabling faster diagnosis and resolution.',
          paragraph9: 'As technology evolves, theoretical foundations remain constant while implementations change. The principles behind consensus algorithms apply whether you\'re using Raft in etcd, Paxos in Spanner, or Byzantine fault tolerance in blockchain systems. Engineers who understand the theory can adapt to new technologies more quickly because they recognize familiar patterns and can predict how new systems will behave.',
          paragraph10: 'Career-wise, engineers with strong theoretical foundations become force multipliers in their organizations. They can mentor junior developers, participate meaningfully in architectural decisions, and avoid the "cargo cult programming" trap where solutions are copied without understanding. They become the engineers that companies turn to for complex problems and system design decisions.',
          paragraph11: 'Furthermore, theoretical knowledge enables innovation and contribution to the field. Understanding existing algorithms and their limitations is the first step toward developing improvements or entirely new approaches. Many of today\'s most successful distributed systems innovations came from engineers who deeply understood existing theory and identified opportunities for advancement.',
          conclusion: 'In conclusion, theoretical foundations in distributed systems are not just academic prerequisites—they are practical tools that enable better decision-making, more effective communication, and more robust system design. They provide the intellectual framework for understanding why certain approaches work, when they might fail, and how to adapt them to specific requirements. For any engineer serious about building reliable, scalable distributed systems, investing time in these theoretical foundations pays dividends throughout their entire career.',
          explore_topics: 'Explore Key Foundation Topics'
      },
      components: {
        overview_title: 'Basic Components',
        overview_subtitle: 'Explore the fundamental building blocks of distributed systems',
        banner_text: 'Each component plays a specific role in building distributed systems. Understand their characteristics, advantages, and challenges.',
        common: {
          example: 'Example:',
          simulator_title: 'Interactive Simulator',
          access_simulator: 'Access Simulator'
        },
        database: {
          title: 'Databases',
          intro: 'Databases are among the most important components of any system, responsible for storing, querying, and managing large volumes of data.',
          relational_title: 'Relational Databases (SQL)',
          relational_p1: 'Relational databases store data in tables with rows and columns. They use SQL for querying and data manipulation.',
          advantages: 'Advantages',
          limitations: 'Limitations',
          relational_adv_1: 'Strong consistency',
          relational_adv_2: 'ACID transactions support (Atomicity, Consistency, Isolation, Durability)',
          relational_adv_3: 'Broad community familiarity',
          relational_adv_4: 'Well-defined data structure',
          relational_lim_1: 'Less flexible for unstructured data',
          relational_lim_2: 'May be harder to scale horizontally due to rigid structure',
          examples_label: 'Examples:',
          examples_sql: 'MySQL, PostgreSQL, Oracle',
          nosql_title: 'NoSQL Databases',
          nosql_p1: 'Non-relational databases offering flexibility to store data as documents, key-value, graphs, or columns.',
          nosql_adv_1: 'High scalability',
          nosql_adv_2: 'Data flexibility',
          nosql_adv_3: 'Support for large volumes of unstructured data',
          nosql_lim_1: 'May trade consistency (eventual consistency) for availability and scalability',
          nosql_mongo_label: 'MongoDB (document database):',
          nosql_mongo_desc: 'Stores data in JSON/BSON format',
          nosql_cassandra_label: 'Cassandra (column store):',
          nosql_cassandra_desc: 'Designed for horizontal scaling, ensuring high availability',
          nosql_redis_label: 'Redis (key-value):',
          nosql_redis_desc: 'An in-memory database, extremely fast, used for cache and other purposes',
          shard_part_rep_title: 'Sharding, Partitioning, and Replication',
          sharding_title: 'Sharding',
          sharding_p1: 'Sharding is like splitting a huge library into several rooms, each with a specific type of book, making it easier to find things.',
          example: 'Example:',
          sharding_example: 'An e-commerce site with millions of users can shard data by region, storing each region\'s users on separate servers.',
          partitioning_title: 'Partitioning',
          partitioning_p1: 'Similar to sharding but with different criteria. Think of organizing a toolbox by size, type, or usage frequency.',
          partitioning_example: 'In a school database, students can be partitioned by school year so each year sits in its own partition.',
          replication_title: 'Replication',
          replication_p1: 'Replication is creating copies of data and storing them on multiple servers to improve availability and durability.',
          sync_rep_label: 'Synchronous Replication:',
          sync_rep_desc: 'Copies are written at the same time, keeping versions identical at all times.',
          sync_rep_example: 'A banking system where each transaction must be recorded in real time across all servers.',
          async_rep_label: 'Asynchronous Replication:',
          async_rep_desc: 'Copies are updated with delay; small differences may exist, but there is backup.',
          async_rep_example: 'A news site where updates can be replicated with a small delay to secondary servers.'
        },
        cards: {
          databases: {
            title: 'Databases',
            description: 'Data storage and management in distributed systems.',
            badges: { persistence: 'Persistence', data: 'Data' }
          },
          cache: {
            title: 'Cache',
            description: 'Temporary storage to improve performance and reduce latency.',
            badges: { performance: 'Performance', speed: 'Speed' }
          },
          load_balancer: {
            title: 'Load Balancer',
            description: 'Intelligent traffic distribution across multiple servers.',
            badges: { distribution: 'Distribution', scalability: 'Scalability' }
          },
          message_queue: {
            title: 'Message Queues',
            description: 'Asynchronous and decoupled communication between services.',
            badges: { async: 'Asynchronous', messaging: 'Messaging' }
          },
          cdn: {
            title: 'CDN',
            description: 'Global content distribution for better performance.',
            badges: { global: 'Global', content: 'Content' }
          },
          api_gateway: {
            title: 'API Gateway',
            description: 'Single entry point for API management.',
            badges: { routing: 'Routing', security: 'Security', control: 'Control' }
          },
          firewall: {
            title: 'Firewall',
            description: 'Traffic protection and control in distributed systems.',
            badges: { security: 'Security', control: 'Control' }
          }
        },
        cdn: {
          what_is_title: 'What is a CDN?',
          what_is_description: 'A CDN is a geographically distributed network of servers used to deliver content (such as image files, videos, or web pages) quickly to users. CDNs store copies of content on multiple servers around the world, reducing latency by serving content from a location closer to the user.',
          benefits_title: 'Benefits of Using a CDN',
          benefit_latency_title: 'Latency Reduction',
          benefit_latency_desc: 'Data is delivered from a server near the user, decreasing response time.',
          benefit_load_title: 'Load Distribution',
          benefit_load_desc: 'The CDN distributes load across multiple servers, preventing overload on central servers.',
          benefit_availability_title: 'Higher Availability',
          benefit_availability_desc: 'If a server fails, the CDN can redirect traffic to another server, ensuring high availability.',
          example_label: 'Example:',
          example_text: 'Use a CDN like Cloudflare to speed up page loading for a global website.',
          simulator_title: 'Interactive Simulator',
          simulator_description: 'Try our interactive CDN simulation to better understand how geographic distribution affects latency and availability.',
          access_simulator: 'Access Simulator'
        },
        api_gateway: {
          title: 'API Gateway',
          lead1: 'Imagine a busy restaurant. You, the customer, place your order with the waiter (API Gateway). He ensures everything works perfectly for you, even if the kitchen is complex and has several specialized cooks.',
          lead2: 'The API Gateway acts as an intelligent intermediary between clients and backend services, simplifying access, increasing security, and improving overall system performance.',
          functions_title: 'API Gateway Functions',
          auth_title: 'Authentication and Authorization',
          auth_p: 'Like security at the restaurant door, it verifies your identity and whether you have permission to enter. The API Gateway checks if the user is logged in and allowed to access the requested resource.',
          auth_example: 'To access your online bank account, you enter your username and password. The API Gateway ensures that only you, with the correct credentials, can access your information.',
          routing_title: 'Routing',
          routing_p: 'It is the waiter who knows exactly which cook (microservice) to send each order to. The API Gateway directs requests to the correct service.',
          routing_example: 'In an e-commerce app, a product request can be routed to the inventory service, while payment is routed to the payment processing service.',
          ratelimit_title: 'Rate Limiting',
          ratelimit_p: 'It is like limiting the number of customers per hour to avoid overload. The API Gateway limits how many requests a client can make to protect backend services.',
          ratelimit_example: 'A weather API service can limit the number of requests per user to prevent abuse and ensure availability for everyone.',
          aggregation_title: 'Response Aggregation',
          aggregation_p: 'It is the waiter who organizes all the dishes of your order on a single tray. The API Gateway combines responses from various services into a single response for the client.',
          aggregation_example: 'In a travel app, the API Gateway can aggregate information from flights, hotels, and car rentals from different providers into a single response.',
          micro_title: 'Example of Microservices-Based Architectures',
          micro_intro: 'In a microservices architecture, the API Gateway acts as a central point for clients to interact with microservices. It forwards requests to the correct services and manages communication between the client and system components.',
          micro_example: 'In a microservices e-commerce application, the API Gateway handles product, cart, and transaction requests, redirecting to the relevant backend services (product, inventory, payment).'
        },
        cache: {
          title: 'Cache',
          intro: 'Cache is a temporary storage layer used to store frequently accessed data, reducing latency and improving performance.',
          memcached_title: 'Memcached',
          memcached_p1: 'Think of Memcached as a whiteboard in your kitchen: quick to write and read, but erased content is gone forever.',
          redis_title: 'Redis',
          redis_p1: 'Redis is like a cabinet with drawers and shelves. Beyond quick access, it allows complex structures and optional persistence.',
          compare_title: 'Comparing both:',
          simplicity_label: 'Simplicity:',
          simplicity_desc: 'Memcached is simpler (whiteboard). Redis is more versatile (cabinet) but requires more organization.',
          datatypes_label: 'Data types:',
          datatypes_desc: 'Memcached stores simple values; Redis supports lists, sets, and other complex structures.',
          persistence_label: 'Persistence:',
          persistence_desc: 'Memcached does not persist data; Redis offers disk persistence to avoid data loss.',
          dist_vs_local_title: 'Distributed vs. Local Cache',
          local_cache_label: 'Local Cache:',
          local_cache_desc: 'Stores data on the same server where processing happens. Fast but not scalable; each server keeps its own version.',
          distributed_cache_label: 'Distributed Cache:',
          distributed_cache_desc: 'Shared among multiple servers, improving scalability and consistency across nodes.',
          simulator_title: 'Interactive Simulator',
          simulator_description: 'Try our interactive cache simulation to better understand how caching impacts system performance.',
          access_simulator: 'Access Simulator',
          simulation: {
            client: 'Client',
            cache: 'Cache',
            database: 'DB',
            configuration: 'Configuration',
            cache_enabled: 'Cache Enabled',
            cache_ttl: 'Cache Time to Live',
            network_delay: 'Network Delay',
            database_delay: 'Database Delay',
            cache_key_placeholder: 'Cache key',
            processing: 'Processing...',
            send: 'Send',
            clear: 'Clear',
            cache_status: 'Cache Status',
            expires_in: 'expires in',
            cache_empty: 'Cache is empty',
            logs: 'Logs',
            request: 'Request',
            cache_hit: 'Cache Hit',
            cache_miss: 'Cache Miss',
            db_query: 'DB Query',
            no_logs: 'No logs available'
          }
        },
        load_balancer: {
          simulator_title: 'Interactive Simulator',
          simulator_description: 'Try our interactive load-balancing simulation to see how different algorithms behave in practice.',
          access_simulator: 'Access Simulator'
        },
        message_queue: {
          simulator_title: 'Interactive Simulator',
          simulator_description: 'Try our interactive message queue simulation to understand asynchronous communication between producers and consumers.',
          access_simulator: 'Access Simulator'
        },
        firewall: {
          title: 'Firewall',
          what_is_title: 'What is a Firewall?',
          what_is_p: 'A Firewall is an essential security component that monitors and controls network traffic based on predefined rules. It acts as a barrier between a trusted network and untrusted networks (such as the Internet), protecting against unauthorized access and cyber threats.',
          features_title: 'Main Features',
          filtering_title: 'Packet Filtering',
          filtering_p: 'Analyzes and filters network packets based on predefined rules such as IP addresses, ports, and protocols.',
          stateful_title: 'Stateful Inspection',
          stateful_p: 'Keeps track of the state of active connections and makes decisions based on the communication context.',
          ips_title: 'Intrusion Prevention',
          ips_p: 'Detects and blocks attack attempts and malicious behavior on the network.',
          types_title: 'Types of Firewall',
          net_fw_title: 'Network Firewall',
          net_fw_p: 'Operates at the network layer, filtering packets based on IP addresses and ports.',
          app_fw_title: 'Application Firewall',
          app_fw_p: 'Analyzes traffic at the application level, offering more granular and specific protection.',
          example_label: 'Example:',
          example_text: 'Configure a firewall to allow only HTTPS traffic (port 443) to a web server, blocking all other ports.',
          simulator_title: 'Interactive Simulator',
          simulator_description: 'Try our interactive Firewall simulation to understand how security rules affect network traffic.',
          access_simulator: 'Access Simulator'
        },
        load_balancer_page: {
          title: 'Load Balancers',
          intro1: 'Load balancers evenly distribute network traffic or requests across multiple servers, preventing any single server from becoming overloaded. For example, an e-commerce system can use a load balancer to distribute requests.',
          intro2: 'In load balancing, multiple server instances process requests simultaneously. This is essential in scalable systems, allowing you to add more servers as demand increases.',
          algos_title: 'Load Balancing Algorithms',
          rr_title: 'Round Robin',
          rr_p: 'Requests are distributed sequentially among available servers, ensuring an even distribution.',
          how_it_works: 'How it works:',
          rr_example: 'If you have 3 servers (A, B, C), the first request goes to A, the second to B, the third to C, the fourth returns to A, and so on.',
          hashing_title: 'Hashing',
          hashing_p: 'Uses a hash (based on IP or another identifier) to ensure requests from a specific client are directed to the same server.',
          use_case: 'Use case:',
          hashing_example: 'Important for maintaining user sessions, ensuring a client always accesses the same server where their session is stored.',
          least_title: 'Least Connections',
          least_p: 'Directs new requests to the server with the fewest active connections, helping to better balance the load.',
          advantage: 'Advantage:',
          least_example: 'More efficient when servers have different capacities or when requests have very variable durations.'
        },
        message_queue_page: {
          title: 'Message Queues',
          intro: 'Message queues are systems used for asynchronous communication between different parts of a system, ensuring that messages can be sent and processed reliably.',
          kafka_title: 'Kafka',
          kafka_p: 'A distributed messaging system designed to process large volumes of data in real time. Used in data pipelines and streaming systems.',
          rabbitmq_title: 'RabbitMQ',
          rabbitmq_p: 'A message broker that supports a wide variety of messaging patterns, such as queuing and message exchange, used for communication between microservices.',
          sqs_title: 'Amazon SQS',
          sqs_p: 'AWS message queue service that offers a scalable and managed queue solution in the cloud.',
          pubsub_title: 'Pub/Sub and Queue Systems',
          pubsub_header: 'Pub/Sub (Publish/Subscribe)',
          pubsub_p: 'A pattern where message producers (publishers) send messages to a channel, and consumers (subscribers) subscribe to receive these messages. The Pub/Sub model allows decoupling between producers and consumers.',
          fifo_header: 'Queue Systems',
          fifo_p: 'Messages are placed in a queue and processed in FIFO (first-in, first-out) manner, ensuring messages are delivered and processed in the order they were received.'
        }
      },
      simulators: {
        consistent_hashing: {
          title: 'Consistent Hashing Simulator',
          subtitle: 'Keys on a ring — add/remove nodes and watch them remap',
          controls: {
            vnodes: 'Virtual nodes per node',
            keys: 'Number of keys',
          },
          buttons: { add_node: 'Add node', remove_node: 'Remove node', shuffle: 'Shuffle keys', reset: 'Reset' },
          metrics: {
            title: 'Live Metrics',
            nodes: 'Nodes',
            vnodes: 'Virtual nodes',
            keys: 'Keys',
            moved: 'Keys moved',
            imbalance: 'Load imbalance',
          },
          labels: {
            node: 'Node',
            hint: 'Add or remove a node — only the highlighted keys move. More virtual nodes means smoother distribution.',
          },
        },
        sharding: {
          title: 'Sharding Simulator',
          subtitle: 'Route keys to shards by range or hash — and watch skew',
          controls: {
            shards: 'Number of shards',
            strategy: 'Strategy',
            skew: 'Key skew',
          },
          strategies: { hash: 'Hash', range: 'Range' },
          buttons: { start: 'Start', stop: 'Stop', reset: 'Reset' },
          metrics: {
            title: 'Live Metrics',
            keys: 'Keys routed',
            shards: 'Shards',
            imbalance: 'Load imbalance',
            hot_load: 'Hottest shard',
          },
          labels: {
            shard: 'Shard',
            hint: 'Crank up skew with range partitioning to create a hot shard — then switch to hash to even it out.',
          },
        },
        inverted_index: {
          title: 'Inverted Index Simulator',
          subtitle: 'Pick query terms and watch documents rank by score',
          modes: { or: 'OR (any term)', and: 'AND (all terms)' },
          buttons: { clear: 'Clear' },
          metrics: {
            title: 'Live Metrics',
            terms: 'Query terms',
            matched: 'Matched docs',
            postings: 'Postings scanned',
            corpus: 'Corpus size',
          },
          labels: {
            query: 'Query terms',
            documents: 'Documents',
            index: 'Inverted index',
            results: 'Ranked results',
            doc: 'Doc',
            score: 'score',
            no_matches: 'No matching documents',
            hint: 'AND intersects postings lists; OR unions them. Score counts how many query terms each document contains.',
          },
        },
        kafka: {
          title: 'Kafka Simulator',
          subtitle: 'Producers, partitions, and a consumer group — watch the lag',
          controls: {
            partitions: 'Partitions',
            consumers: 'Consumers',
            produce_rate: 'Produce rate',
            consume_rate: 'Consume / consumer',
          },
          buttons: { start: 'Start', stop: 'Stop', reset: 'Reset' },
          metrics: {
            title: 'Live Metrics',
            produced: 'Produced',
            consumed: 'Consumed',
            lag: 'Consumer lag',
            throughput: 'Consume capacity',
          },
          labels: {
            partition: 'P',
            producer: 'Producer',
            consumers: 'Consumer group',
            consumer: 'C',
            idle: 'idle',
            hint: 'Each partition is read by exactly one consumer. Add consumers beyond the partition count and they sit idle — partitions cap parallelism.',
          },
        },
        saga: {
          title: 'Saga Simulator',
          subtitle: 'A distributed transaction as a sequence of compensable steps',
          controls: { mode: 'Coordination', fail_at: 'Inject failure at step' },
          modes: { orchestrated: 'Orchestrated', choreographed: 'Choreographed' },
          fail_none: 'None',
          buttons: { run: 'Run saga', reset: 'Reset' },
          roles: { coordinator: 'Saga Coordinator' },
          steps: {
            reserve: 'Reserve inventory',
            payment: 'Charge payment',
            shipping: 'Book shipping',
            confirm: 'Send confirmation',
          },
          status: {
            pending: 'Pending',
            running: 'Running',
            done: 'Committed',
            failed: 'Failed',
            compensated: 'Compensated',
          },
          metrics: { title: 'Result', committed: 'Steps committed', compensated: 'Steps compensated', outcome: 'Outcome' },
          outcome: { idle: 'Idle', committed: 'Committed', rolled_back: 'Rolled back' },
          labels: {
            hint: 'A saga has no global rollback. When a step fails, each completed step is undone by its own compensating action, in reverse order.',
          },
        },
        delivery_semantics: {
          title: 'Delivery Semantics Simulator',
          subtitle: 'At-most-once vs at-least-once vs exactly-once',
          controls: { mode: 'Semantics', dedup: 'Deduplication', dlq: 'Dead-letter queue' },
          modes: { at_most_once: 'At-most-once', at_least_once: 'At-least-once', exactly_once: 'Exactly-once' },
          buttons: { start: 'Start', stop: 'Stop', reset: 'Reset', on: 'On', off: 'Off' },
          metrics: {
            title: 'Live Metrics',
            produced: 'Produced',
            delivered: 'Delivered',
            duplicates: 'Duplicates',
            filtered: 'Dedup filtered',
            lost: 'Lost',
            dlq: 'Dead-lettered',
          },
          tags: {
            delivered: 'Delivered',
            duplicate: 'Duplicate',
            lost: 'Lost',
            dlq: 'Dead-letter',
            filtered: 'Filtered',
          },
          labels: {
            recent: 'Recent messages',
            empty: 'No messages yet',
            hint: 'At-most-once can lose messages; at-least-once can duplicate them. "Exactly-once" = at-least-once delivery plus deduplication on the consumer.',
          },
        },
        cqrs: {
          title: 'CQRS Simulator',
          subtitle: 'Commands append events; read models are projections',
          controls: { lag: 'Projection lag' },
          commands: { create: 'Create order', add_item: 'Add item', ship: 'Ship order', cancel: 'Cancel order' },
          buttons: { reset: 'Reset' },
          panels: { command: 'Command side (write)', log: 'Event log', read: 'Read models (query)' },
          events: { created: 'OrderCreated', item_added: 'ItemAdded', shipped: 'OrderShipped', cancelled: 'OrderCancelled' },
          read: { status: 'Order status', items: 'Item count', events_applied: 'Events applied', pending: 'Pending' },
          status_values: { none: '—', created: 'Created', shipped: 'Shipped', cancelled: 'Cancelled' },
          labels: {
            log_empty: 'No events yet — issue a command',
            lag_caption: 'Projection caught up: {{pct}}%',
            hint: 'Writes go to the event log instantly; read models update asynchronously. Raise the lag to see eventual consistency — the read side trails the write side.',
          },
        },
        inference_batching: {
          title: 'Inference Batching Simulator',
          subtitle: 'Continuous batching on a single GPU — throughput vs latency',
          controls: {
            arrival_rate: 'Arrival rate (req/s)',
            batch_capacity: 'Batch capacity (KV slots)',
            output_tokens: 'Avg output tokens',
          },
          buttons: { start: 'Start', stop: 'Stop', reset: 'Reset' },
          panels: {
            batch: 'Running Batch (GPU)',
            queue: 'Admission Queue',
            metrics: 'Live Metrics',
          },
          metrics: {
            throughput: 'Throughput (tok/s)',
            utilization: 'Batch utilization',
            queue_depth: 'Queue depth',
            avg_latency: 'Avg latency',
            completed: 'Completed',
            dropped: 'Dropped',
          },
          labels: {
            slot_free: 'free slot',
            tokens: 'tok',
            waiting: 'waiting',
            batch_empty: 'GPU idle — no requests in batch',
            queue_empty: 'Queue empty',
            request: 'REQ',
          },
        },
        rag_pipeline: {
          title: 'RAG Pipeline Simulator',
          subtitle: 'Embed → search → rerank → assemble → generate',
          controls: {
            chunk_size: 'Chunk size (tokens)',
            top_k: 'Retrieve top-K',
            rerank: 'Reranking',
          },
          buttons: { run: 'Run Query', reset: 'Reset', on: 'On', off: 'Off' },
          stages: {
            embed: 'Embed Query',
            search: 'Vector Search',
            rerank: 'Rerank',
            assemble: 'Assemble Context',
            generate: 'Generate',
          },
          metrics: {
            recall: 'Retrieval recall',
            latency: 'Total latency',
            cost: 'Cost / query',
            context: 'Context used',
            quality: 'Answer quality',
          },
          labels: {
            idle: 'Idle — run a query to start',
            chunk: 'chunk',
            score: 'score',
            retrieved: 'Retrieved chunks',
            disabled: 'disabled',
          },
        },
        vector_search: {
          title: 'Vector Search Simulator',
          subtitle: 'Approximate nearest neighbors with HNSW',
          controls: {
            ef_search: 'efSearch (candidate list)',
            m_links: 'M (graph connections)',
            dataset: 'Dataset size',
          },
          buttons: { search: 'Run Search', reset: 'Reset' },
          metrics: {
            recall: 'Recall@10',
            latency: 'Query latency',
            comparisons: 'Distance comps',
            memory: 'Index memory',
          },
          labels: {
            idle: 'Run a search to probe the index',
            exact: 'Exact (brute force)',
            approx: 'HNSW (approximate)',
            found: 'Neighbors found',
          },
        },
        llm_gateway: {
          title: 'LLM Gateway Simulator',
          subtitle: 'Semantic cache, model fallback, rate limiting & cost',
          controls: {
            cache_rate: 'Cache hit rate (%)',
            rate_limit: 'Rate limit (req/s)',
            primary_fail: 'Primary failure (%)',
          },
          buttons: { start: 'Start', stop: 'Stop', reset: 'Reset' },
          routes: {
            cache: 'Served from cache',
            primary: 'Primary model',
            fallback: 'Fallback model',
            rejected: 'Rate limited',
          },
          metrics: {
            served: 'Served',
            cache_hits: 'Cache hits',
            fallbacks: 'Fallbacks',
            rejected: 'Rejected',
            cost: 'Total cost',
          },
          labels: {
            recent: 'Recent requests',
            empty: 'No requests yet',
          },
        },
        gpu_autoscaler: {
          title: 'GPU Autoscaler Simulator',
          subtitle: 'Cold starts, queueing & scale-to-zero',
          controls: {
            arrival_rate: 'Arrival rate (req/s)',
            scale_threshold: 'Scale-up queue threshold',
            cold_start: 'Cold start (s)',
          },
          buttons: { start: 'Start', stop: 'Stop', reset: 'Reset' },
          panels: {
            replicas: 'GPU Replicas',
            metrics: 'Live Metrics',
          },
          metrics: {
            replicas: 'Active replicas',
            queue: 'Queue depth',
            latency: 'Avg latency',
            cost: 'Cost ($/min)',
            utilization: 'Utilization',
          },
          labels: {
            warming: 'WARMING',
            ready: 'READY',
            idle: 'IDLE',
            scale_to_zero: 'Scaled to zero — no active GPUs',
          },
        },
        agent_orchestration: {
          title: 'Agent Orchestration Simulator',
          subtitle: 'Reason → act → observe loop with tool calls',
          controls: {
            max_steps: 'Max steps',
            tool_latency: 'Tool latency (ms)',
            fail_rate: 'Tool failure (%)',
          },
          buttons: { run: 'Run Agent', reset: 'Reset' },
          steps: {
            think: 'Think',
            act: 'Call Tool',
            observe: 'Observe',
            answer: 'Final Answer',
            retry: 'Retry',
          },
          tools: {
            search: 'web_search',
            calculator: 'calculator',
            database: 'db_query',
          },
          metrics: {
            steps: 'Steps taken',
            tool_calls: 'Tool calls',
            retries: 'Retries',
            tokens: 'Tokens used',
            status: 'Status',
          },
          labels: {
            idle: 'Idle — run the agent to start',
            running: 'Running',
            done: 'Done',
            failed: 'Failed (max steps reached)',
            trace: 'Execution trace',
          },
        },
        gateway: {
          title: 'API Gateway Simulator',
          description: 'See how an API Gateway routes different types of requests to the appropriate services in a microservices architecture.',
          buttons: {
            start: 'Start Simulation',
            stop: 'Stop Simulation',
            show_config: 'Show Settings',
            hide_config: 'Hide Settings',
            reset: 'Reset',
            restore_defaults: 'Restore Defaults'
          },
          config: {
            title: 'Simulation Settings',
            rps: 'Requests per Second: {{value}}',
            routing_delay: 'Routing Delay: {{ms}}ms',
            extra_error_rate: 'Additional Error Rate: {{percent}}%',
            removal_delay: 'Removal Time: {{ms}}ms'
          },
          stats: {
            total: 'Total Requests',
            success: 'Successful Requests',
            error: 'Requests with Error'
          },
          columns: {
            clients: 'Clients',
            apigw: 'API Gateway',
            microservices: 'Microservices'
          },
          items: {
            request_id: 'Request #{{id}}',
            type: 'Type: {{type}}',
            routing_to: 'Routing #{{id}}',
            to_service: 'To: {{service}}',
            processing_time: 'Processing time: {{ms}}ms',
            base_error_rate: 'Base error rate: {{percent}}%',
            error: 'Error',
            processing: 'Processing'
          }
        },
        circuit_breaker: {
          title: 'Circuit Breaker',
          buttons: {
            settings: 'Settings',
            start: 'Start',
            stop: 'Stop',
            start_errors: 'Start Errors',
            stop_errors: 'Stop Errors',
            reset: 'Reset'
          },
          labels: {
            rps: 'Requests/s:',
            state: 'State',
            reset_in: 'Reset in',
            consecutive_failures: 'Consecutive Failures',
            error_status: 'Error Status',
            active_with_chance: 'Active ({{percent}}% chance)',
            inactive: 'Inactive',
            latest_requests: 'Latest Requests',
            no_requests: 'No requests made'
          }
        },
        polling_webhooks: {
          title: 'Simulator: Polling vs Webhooks',
          subtitle: 'See in practice the difference between polling and webhooks with our interactive simulation',
          ctas: {
            read_theory: 'Read Full Theory First',
            back_to_theory: 'Back to Theory',
            back_to_components: 'Basic Components'
          },
          buttons: {
            polling: 'Polling',
            webhook: 'Webhook',
            start: 'Start',
            stop: 'Stop',
            reset: 'Reset'
          },
          config: {
            polling_interval: 'Polling Interval',
            data_generation: 'Data Generation',
            network_latency: 'Network Latency'
          },
          flow: {
            title: 'Communication Flow',
            client: 'Client',
            server: 'Server',
            active_mode: 'Active Mode:',
            active_sim: '🟢 Simulation Active ({{mode}})',
            stopped_sim: '🔴 Simulation Stopped'
          },
          stats: {
            title: 'Real-time Statistics',
            total_requests: 'Total Requests',
            empty_responses: 'Empty Responses',
            data_transfers: 'Data Transfers',
            webhooks_sent: 'Webhooks Sent',
            total_bandwidth_bits: 'Total Bandwidth (bits)',
            efficiency: 'Efficiency',
            success_rate: 'Success Rate',
            wasted_requests: 'Wasted Requests'
          },
          queue: {
            pending_data: 'Pending Data ({{count}})',
            none: 'No pending data'
          },
          log: {
            title: 'Message Log',
            with_data: 'With data',
            start_prompt: 'Start the simulation to see messages...'
          },
          messages: {
            checking: 'Checking for new data...',
            data_found: 'Data found: {{content}}',
            no_data: 'No new data available'
          }
        },
        message_queue_sim: {
          title: 'Message Queue',
          buttons: {
            configure: 'Configure',
            close_config: 'Close Config',
            start: 'Start',
            stop: 'Stop',
            reset: 'Reset'
          },
          config: {
            producers: 'Producers',
            production_rate: 'Production Rate',
            max_queue_size: 'Max Queue Size',
            consumers: 'Consumers',
            consumption_rate: 'Consumption Rate',
            process_time: 'Processing Time'
          },
          flow: {
            title: 'Message Flow',
            queue: 'Queue',
            more: '+{{count}} more'
          },
          queue_status: {
            title: 'Queue Status',
            size: 'Queue Size',
            produced: 'Produced',
            processed: 'Processed',
            dropped: 'Dropped',
            avg_time: 'Avg Time'
          },
          messages: {
            title: 'Messages',
            none: 'No messages yet',
            accepted: 'Request accepted',
            rejected: 'Request rejected'
          }
        },
        rate_limiter: {
          title: 'Rate Limiter',
          strategy: 'Algorithm',
          algorithms: {
            token: 'Token bucket',
            leaky: 'Leaky bucket',
            sliding: 'Sliding window'
          },
          algo_desc: {
            token: 'Tokens refill at a steady rate; each request spends one. Allows bursts up to the bucket size.',
            leaky: 'Requests fill a fixed queue that drains at a constant rate. Smooths output; rejects when the queue is full.',
            sliding: 'Counts requests in the trailing 1s window; rejects once the limit is reached. No bursts beyond the limit.'
          },
          level: {
            token: 'Tokens available',
            leaky: 'Queue depth',
            sliding: 'Window count (1s)'
          },
          buttons: {
            configure: 'Configure',
            close_config: 'Close Config',
            start: 'Start',
            stop: 'Stop',
            reset: 'Reset'
          },
          config: {
            token_rate: 'Refill / leak / limit (per second)',
            message_rate: 'Message Rate (per second)',
            bucket_size: 'Bucket / queue size'
          },
          bucket: {
            title: 'Token Bucket',
            rate: 'Rate: {{rate}} /s'
          },
          recent: {
            title: 'Recent Requests',
            rate: 'Rate: {{rate}} msgs/s',
            accepted: 'Request accepted',
            rejected: 'Request rejected',
            none: 'No requests yet'
          },
          metrics: {
            total: 'Total Requests',
            accepted: 'Accepted',
            rejected: 'Rejected'
          }
        },
        backpressure: {
          title: 'Backpressure',
          buttons: {
            settings: 'Settings',
            start: 'Start',
            stop: 'Stop',
            reset: 'Reset'
          },
          producer_status: {
            title: 'Producer Status',
            throttled: 'Throttled',
            normal: 'Normal'
          },
          labels: {
            produced: 'Produced Messages',
            processed: 'Processed Messages',
            dropped: 'Dropped Messages',
            latest: 'Latest Messages'
          }
        },
        retries: {
          title: 'Retries Simulator',
          buttons: { settings: 'Settings', start: 'Start Simulation', simulating: 'Simulating...' },
          settings: {
            title: 'Simulation Settings',
            max_retries: 'Max Retries: {{value}}',
            base_delay: 'Base Delay: {{ms}}ms',
            success_rate: 'Success Rate: {{percent}}%'
          },
          toggles: { use_exponential_backoff: 'Use Exponential Backoff', add_jitter: 'Add Jitter' },
          visualization: { title: 'Visualization' },
          attempt: { label: 'Attempt {{id}}', next_in: 'Next attempt in {{ms}}ms' },
          stats: { title: 'Statistics', total_attempts: 'Total Attempts', final_status: 'Final Status', status_success: 'Success', status_failure: 'Failure' },
          info: {
            title: 'Explanation',
            p1: 'This simulator demonstrates how retry mechanisms work in distributed systems. Each attempt has a success chance based on the configured rate.',
            p2: 'With exponential backoff, the time between attempts increases progressively (1s, 2s, 4s, 8s...), reducing system load.',
            p3: 'Jitter adds a random variation to the time between attempts, preventing multiple clients from retrying at the exact same time.'
          }
        },

        round_robin: {
          title: 'Load Balancer',
          buttons: {
            start: 'Start Simulation',
            stop: 'Stop Simulation'
          },
          config: {
            strategy: 'Strategy',
            server_count: 'Number of Servers',
            server_capacity: 'Server Capacity',
            rps: 'Requests per Second'
          },
          strategies: {
            round_robin: 'Round Robin: Distributes requests sequentially among all servers in circular order.',
            least_conn: 'Least Connections: Sends new requests to the server with the lowest current load.',
            random: 'Random: Selects a server at random for each new request.'
          },
          server_card: {
            server_label: 'Server {{id}}',
            requests: '{{current}}/{{capacity}} requests',
            response_time_ms: '({{ms}}ms)',
            response_time_label: 'Response Time:'
          }
        },
        cdn: {
          title: 'CDN Simulation',
          buttons: { configure: 'Configure', close_config: 'Close Config', reset: 'Reset' },
          config: {
            title: 'Settings',
            base_latency_multiplier: 'Base Latency Multiplier (No Cache)',
            cache_latency_multiplier: 'Cache Latency Multiplier',
            max_logs: 'Maximum Number of Logs'
          },
          labels: {
            x_suffix: 'x',
            logs_suffix: 'logs',
            country_select: 'Select your country:',
            datacenters: 'Datacenters:',
            cache_badge: 'Cache ✓',
            latency: 'Latency'
          },
          messages: { processing: 'Processing request...' },
          history: { title: 'Request History:', cache_hit: 'Cache Hit' },
          info: {
            title: 'How does it work?',
            i1: 'Select your country to simulate a request',
            i2: 'The nearest datacenter will be chosen automatically',
            i3: 'First request: Fetches from origin server ({{base}}x latency)',
            i4: 'Subsequent requests: Served from local cache ({{cache}}x latency)',
            i5: 'Latency varies according to the distance between your country and the datacenter'
          }
        },
        firewall: {
          title: 'Firewall Simulator',
          lead: 'This simulator demonstrates how a firewall filters network packets based on predefined rules. Watch how different types of traffic are allowed or blocked.',
          rules: { title: 'Firewall Rules', restore_title: 'Restore initial configuration', add_rule: 'Add Rule', remove_rule_title: 'Remove rule' },
          stats: { title: 'Statistics', total: 'Total Packets', allowed: 'Allowed', blocked: 'Blocked' },
          traffic: { title: 'Network Traffic', custom_packet: 'Custom Packet', generate_packet: 'Generate Packet', stop_autogen: 'Stop', start_autogen: 'Auto Generate' },
          labels: { port: 'Port', protocol: 'Protocol', type: 'Type', payload: 'Payload', action_allow: 'Allow', action_block: 'Block' },
          badges: { allow: 'ALLOWED', block: 'BLOCKED' },
          empty: 'No packets generated yet. Click "Generate Packet" to start.',
          add_rule_modal: {
            title: 'New Rule',
            origin: 'Source',
            destination: 'Destination',
            port: 'Port',
            protocol: 'Protocol',
            type: 'Type',
            action: 'Action',
            placeholder_ip_or_star: 'IP or *',
            placeholder_port_or_zero: 'Port or 0',
            option_select: 'Select',
            button_cancel: 'Cancel',
            button_add: 'Add'
          },
          custom_packet_modal: {
            title: 'Send Custom Packet',
            origin: 'Source',
            destination: 'Destination',
            port: 'Port',
            protocol: 'Protocol',
            type: 'Type',
            payload: 'Payload',
            placeholder_origin_ip: 'IP (e.g., 192.168.1.1)',
            placeholder_destination_ip: 'IP (e.g., 10.0.0.1)',
            placeholder_port: 'Port (e.g., 80)',
            placeholder_payload: 'Packet data',
            button_cancel: 'Cancel',
            button_send: 'Send Packet'
          },
          errors: {
            source_required: 'Source IP is required',
            destination_required: 'Destination IP is required',
            port_required: 'Port is required'
          },
          info: {
            title: 'How does it work?',
            i1: 'The simulator generates random network packets with different sources, destinations and ports',
            i2: 'Firewall rules are evaluated in order, from first to last',
            i3: 'The first rule that matches determines whether the packet is allowed or blocked',
            i4: 'The last rule (default) blocks all traffic not specified by previous rules',
            i5: 'You can add your own rules and see how they affect traffic',
            i6: 'Use the "Auto Generate" mode to watch a continuous flow of packets'
          }
        },
        horizontal_scaling: {
          title: 'Horizontal Scalability Simulator',
          intro: 'Visualize how load is distributed across multiple servers and how the system scales automatically based on demand.',
          controls: {
            request_rate: 'Request Rate/s',
            processing_time_ms: 'Processing Time (ms)',
            auto_scaling: 'Auto-Scaling',
            scale_up: 'Scale Up:',
            scale_down: 'Scale Down:',
            percent: '%'
          },
          buttons: {
            start: 'Start',
            stop: 'Stop',
            add_server: 'Add Server',
            remove_server: 'Remove Server'
          },
          server_card: {
            server_label: 'Server {{id}}',
            active: 'Active',
            inactive: 'Inactive',
            load: 'Load',
            processed_requests: 'Processed requests: {{count}}'
          },
          requests: {
            recent: 'Latest Requests',
            server_label: 'Server {{id}}',
            status_completed: 'Completed',
            status_failed: 'Failed',
            status_processing: 'Processing'
          }
        },
        vertical_scaling: {
          title: 'Vertical Scalability Simulator',
          intro: 'Manage server resources and observe how it handles different workloads.',
          level_of_total: 'Level {{current}} of {{total}}',
          buttons: { downgrade: 'Downgrade', upgrade: 'Upgrade', start: 'Start Simulation', stop: 'Stop Simulation' },
          resources: { cpu: 'CPU ({{cores}} cores)', memory: 'Memory ({{gb}} GB)', storage: 'Storage ({{gb}} GB)' },
          queue_title: 'Request Queue',
          controls_title: 'Controls',
          request_rate: 'Request Rate ({{rate}}/s)',
          stats_title: 'Statistics',
          processed: 'Processed', rejected: 'Rejected', success_rate: 'Success Rate', uptime: 'Uptime', total_cost: 'Total Cost', current_load: 'Current Load',
          statuses: { healthy: 'healthy', degraded: 'degraded', failed: 'failed', role: 'Role', data: 'Data', keys: 'keys', replicated_after: 'Replicated after {{seconds}}s' },
          simulate_failure: 'Simulate Failure', recover: 'Recover',
          upgrade_modal: { title: 'Upgrade Server', text: 'Are you sure you want to upgrade to {{tier}}? This will increase your costs to ${{cost}}/month.', cancel: 'Cancel', confirm: 'Upgrade' }
        },
        scalability: {
          title: 'Scalability Simulator',
          intro: 'Explore how consistency, latency and failover work in a distributed system.',
          how_title: 'How to use the simulator:',
          how_steps: [
            'Configure the consistency mode: Strong (instant replication) or Eventual (replication with latency)',
            'Adjust network latency to see how it affects replication (higher values show eventual delays)',
            'Try scenarios: simulate server failures (failover), compare consistency propagation, observe request effects'
          ],
          config_title: 'Settings',
          consistency_mode: 'Consistency Mode',
          strong: 'Strong', eventual: 'Eventual',
          network_latency_ms: 'Network Latency (ms)',
          failure_rate: 'Failure Rate',
          auto_failover: 'Auto Failover',
          manual_title: 'Manual Operation',
          read: 'Read', write: 'Write',
          key_placeholder: 'Key', value_placeholder: 'Value', execute: 'Execute',
          start: 'Start Simulation', stop: 'Stop Simulation',
          role: 'Role', latency: 'Latency', data: 'Data', keys_label: '{{count}} keys', replicated_after: 'Replicated after {{seconds}}s',
          simulate_failure: 'Simulate Failure', recover: 'Recover',
          recent_requests: 'Recent Requests',
          read_label: 'Read', write_label: 'Write'
        },
        timeout: {
          title: 'Timeout Simulator',
          buttons: { settings: 'Settings', start: 'Start', stop: 'Stop', reset: 'Reset' },
          settings: {
            title: 'Simulation Settings',
            timeout: 'Timeout: {{seconds}}s',
            rps: 'Requests per Second: {{value}}',
            min_response: 'Minimum Response Time: {{seconds}}s',
            max_response: 'Maximum Response Time: {{seconds}}s',
            success_rate: 'Success Rate: {{percent}}%'
          },
          visualization: { title: 'Visualization' },
          request_label: 'Request {{id}}',
          statuses: { success: 'Request completed successfully', timeout: 'Timeout: Request exceeded {{seconds}}s', error: 'Server error' },
          stats: { title: 'Statistics', total: 'Total Requests', timeouts: 'Timeouts' },
          info: {
            title: 'Explanation',
            p1: 'This simulator demonstrates how the timeout mechanism works in distributed systems. Each request has a configurable timeout to be completed.',
            p2: 'If the response does not arrive within the timeout, the request is canceled and a timeout error is returned, preventing resources from being stuck indefinitely.',
            p3: 'Adjust timeout, response times, and success rate to visualize impacts.'
          }
        },
        event_sourcing: {
          title: 'Event Sourcing Simulator',
          buttons: { settings: 'Settings', reset: 'Reset', replay: 'Replay' },
          intro: 'Explore how Event Sourcing works in an e-commerce system, where each state change is recorded as an immutable event.',
          settings: {
            title: 'Simulation Settings',
            auto_advance: 'Auto Advance',
            event_delay: 'Event Delay: {{ms}}ms',
            show_event_data: 'Show Event Data',
            animation_duration: 'Animation Duration: {{seconds}}s'
          },
          create_order: {
            title: 'Create Order',
            selected_items: 'Selected Items:',
            total: 'Total: ${{amount}}',
            create_button: 'Create Order'
          },
          actions: {
            pay: 'Confirm Payment',
            ship: 'Ship Order',
            deliver: 'Confirm Delivery',
            cancel: 'Cancel Order'
          },
          state: {
            title: 'Current State',
            order: 'Order: {{id}}',
            status: 'Status: {{status}}',
            total: 'Total: ${{amount}}',
            tracking: 'Tracking: {{code}}',
            items: 'Items:'
          },
          events: {
            title: 'Events',
            speed: 'Speed:',
            speed_opts: { half: '0.5s', one: '1s', two: '2s' }
          }
        },
        canary: {
          title: 'Canary Deployment Simulator',
          buttons: {
            settings: 'Settings',
            deploy_canary: 'Deploy Canary',
            pause: 'Pause',
            resume: 'Resume',
            increase_traffic: '+10% Traffic',
            promote: 'Promote to 100%',
            rollback: 'Rollback',
            inject_errors: 'Inject Errors',
            stop_errors: 'Stop Errors',
            reset: 'Reset'
          },
          settings: {
            title: 'Simulation Settings',
            canary_traffic: 'Canary Traffic: {{percent}}%',
            canary_error_rate: 'Canary Error Rate: {{percent}}%',
            rps: 'Requests/sec: {{value}}',
            rollback_threshold: 'Auto-Rollback Threshold: {{percent}}%'
          },
          labels: {
            phase: 'Phase',
            stable_servers: 'Stable Servers',
            canary_server: 'Canary Server',
            traffic: 'traffic',
            requests: 'Requests',
            errors: 'Errors',
            metrics: 'Metrics',
            total_requests: 'Total Requests',
            canary_requests: 'Canary Requests',
            canary_error_rate: 'Canary Error Rate',
            stable_error_rate: 'Stable Error Rate',
            live_requests: 'Live Requests',
            no_requests: 'No requests yet. Deploy a canary to start.',
            event_log: 'Event Log',
            waiting_logs: 'Waiting for events...'
          },
          logs: {
            deploying_canary: '🚀 Deploying canary version...',
            canary_deployed: '✅ Canary deployed successfully',
            promoting_canary: '📈 Promoting canary to 100%...',
            promotion_complete: '✅ Promotion complete - canary is now stable',
            rolling_back: '⚠️ Rolling back to stable version...',
            rollback_complete: '✅ Rollback complete',
            simulation_reset: '🔄 Simulation reset',
            traffic_increased: '📈 Traffic increased to {{percent}}%',
            auto_rollback_triggered: '🚨 Auto-rollback triggered! Error rate: {{rate}}%'
          },
          info: {
            title: 'ℹ️ How to Use',
            try_this: {
              title: 'Try This:',
              item1: 'Deploy a canary and watch traffic distribution',
              item2: 'Gradually increase traffic to the canary',
              item3: 'Inject errors to see auto-rollback in action',
              item4: 'Promote the canary when confident'
            },
            observe: {
              title: 'Observe:',
              item1: 'Error rates for stable vs canary',
              item2: 'Request distribution across servers',
              item3: 'Auto-rollback when threshold is exceeded'
            },
            real_world: {
              title: 'Real World:',
              text: 'In production, you would monitor latency, error rates, and business metrics before promoting a canary.'
            }
          }
        }
      },
      pages: {
        api_gateway: {
          title: 'API Gateway',
          lead1: 'Imagine a busy restaurant. You, the customer, place your order with the waiter (API Gateway). He makes sure everything works perfectly for you, even if the kitchen is complex with several specialized cooks.',
          lead2: 'The API Gateway acts as an intelligent intermediary between clients and backend services, simplifying access, increasing security, and improving overall system performance.',
          functions_title: 'API Gateway Functions',
          auth_title: 'Authentication and Authorization',
          auth_p: 'It is like security at the restaurant door, verifying your identity and whether you have permission to enter. The API Gateway checks if the user is logged in and allowed to access the requested resource.',
          routing_title: 'Routing',
          routing_p: 'It is the waiter who knows exactly which cook (microservice) to send each order to. The API Gateway directs requests to the correct service.',
          ratelimit_title: 'Rate Limiting',
          ratelimit_p: 'It is like limiting the number of customers per hour to avoid overload. The API Gateway limits how many requests a client can make to protect backend services.',
          aggregation_title: 'Response Aggregation',
          aggregation_p: 'It is the waiter who organizes all the dishes of your order on a single tray. The API Gateway combines responses from various services into a single response for the client.',
          micro_title: 'Example of Microservices-Based Architectures',
          micro_intro: 'In a microservices architecture, the API Gateway acts as a central point for clients to interact with microservices. It forwards requests to the correct services and manages the communication between the client and the various components.',
          micro_example: 'In an e-commerce application based on microservices, the API Gateway handles product, shopping cart, and transaction requests, redirecting to the relevant backend services (product, inventory, payment).'
        },
        firewall: {
          title: 'Firewall',
          what_is_title: 'What is a Firewall?',
          what_is_p: 'A Firewall is an essential security component that monitors and controls network traffic based on predefined rules. It acts as a barrier between a trusted network and untrusted networks (such as the Internet), protecting against unauthorized access and cyber threats.',
          features_title: 'Main Features',
          filtering_title: 'Packet Filtering',
          filtering_p: 'Analyzes and filters network packets based on predefined rules such as IP addresses, ports, and protocols.',
          stateful_title: 'Stateful Inspection',
          stateful_p: 'Keeps track of the state of active connections and makes decisions based on the communication context.',
          ips_title: 'Intrusion Prevention',
          ips_p: 'Detects and blocks attack attempts and malicious behavior on the network.',
          types_title: 'Types of Firewall',
          net_fw_title: 'Network Firewall',
          net_fw_p: 'Operates at the network layer, filtering packets based on IP addresses and ports.',
          app_fw_title: 'Application Firewall',
          app_fw_p: 'Analyzes traffic at the application level, offering more granular and specific protection.',
          example_text: 'Configure a firewall to allow only HTTPS traffic (port 443) to a web server, blocking all other ports.'
        }
      },
      polling_webhooks_theory: {
        title: 'Polling vs Webhooks',
        subtitle: 'Understand the fundamental differences between these two communication strategies',
        problem_title: 'The Communication Problem',
        problem_polling_title: '📤 Polling (Query)',
        problem_polling_text: '"I will ask from time to time if there is something new"',
        problem_webhook_title: '🔔 Webhooks (Notification)',
        problem_webhook_text: '"Notify me immediately when there is something new"',
        polling_title: '📤 Polling (Periodic Query)',
        how_it_works: 'How It Works',
        typical_flow: 'Typical Flow:',
        advantages: 'Advantages',
        disadvantages: 'Disadvantages',
        when_to_use_polling: '💡 When to Use Polling',
        webhooks_title: '🔔 Webhooks (Push Notifications)',
        when_to_use_webhooks: '💡 When to Use Webhooks',
        comparison_title: '⚖️ Detailed Comparison',
        table: {
          aspect: 'Aspect',
          polling: '📤 Polling',
          webhooks: '🔔 Webhooks',
          latency: 'Latency',
          bandwidth: 'Bandwidth Usage',
          complexity: 'Complexity',
          scalability: 'Scalability',
          network_requirements: 'Network Requirements',
          control: 'Control',
          debugging: 'Debugging',
          reliability: 'Reliability'
        },
        real_world_title: '🌍 Real-World Examples',
        polling_use_cases: '📤 Use Cases - Polling',
        webhook_use_cases: '🔔 Use Cases - Webhooks',
        implementation_title: '🛠️ Implementation Considerations',
        implementing_polling: 'Implementing Polling',
        common_strategies: '🔧 Common Strategies',
        important_care: '⚠️ Important Considerations',
        implementing_webhooks: 'Implementing Webhooks',
        essential_security: '🔒 Essential Security',
        reliability_patterns: '🔄 Reliability Patterns',
        hybrid_title: '🔄 Hybrid Approaches',
        card_fallback: '🔄 Fallback Strategy',
        card_realtime_batch: '⚡ Real-time + Batch',
        card_context_aware: '🎯 Context-Aware',
        cta_title: '🚀 Ready to See It in Practice?',
        cta_subtitle: 'Now that you understand the concepts, try our interactive simulator to see the difference in action!'
      },
      design_principles: {
        index: {
          title: 'Design Principles',
          subtitle: 'Explore the fundamental principles that guide the creation of distributed systems',
          banner1: 'Each principle addresses crucial aspects of modern distributed systems design.',
          banner2: 'Understand how to apply them to build scalable and resilient systems.',
          cards: {
            event_driven: {
              title: 'Event-Driven Development',
              description: 'Event Sourcing and distributed event systems.',
              badge1: 'Events',
              badge2: 'Asynchronous'
            },
            service_oriented: {
              title: 'Service-Oriented Design',
              description: 'Microservices vs Monolithic Architecture.',
              badge1: 'Services',
              badge2: 'Architecture'
            },
            fault_tolerance: {
              title: 'Fault Tolerance',
              description: 'Retries, Circuit Breakers, Timeout and Fallback.',
              badge1: 'Resilience',
              badge2: 'Recovery'
            },
            scalability: {
              title: 'Design for Scalability',
              description: 'Horizontal and vertical scalability.',
              badge1: 'Growth',
              badge2: 'Performance'
            },
            high_availability: {
              title: 'High Availability',
              description: 'Availability zones and replication.',
              badge1: 'Uptime',
              badge2: 'Replication'
            }
          }
        },
        event_driven: {
          title: 'Event-Driven Development',
          intro: 'Event-driven development is an approach where actions and changes in the system are triggered and managed by events. An event is any significant action that occurs in the system, such as a purchase transaction or a database update.',
          event_sourcing_title: 'Event Sourcing',
          event_sourcing_p: 'Event sourcing is a design pattern in which the state of a system is derived from a sequence of events, instead of a stored current state. Each state change is captured as an immutable event, and the system can be rebuilt at any time by replaying these events.',
          advantages_title: 'Advantages',
          advantages_list: [
            'Complete history of changes in the system',
            'Easy to audit and track actions',
            'Support for reverting or replaying events'
          ],
          example_title: 'Example',
          event_sourcing_example: 'An e-commerce system where each update to an order status (placed, processed, shipped) is recorded as an event. The final state of the order is determined by the sequence of events.',
          dist_events_title: 'Distributed Event Systems',
          dist_events_p: 'Distributed event systems allow different parts of a system (often on different servers) to communicate and synchronize based on events. They are essential for asynchronous systems where different components can react to events in a decentralized manner.',
          tools_title: 'Popular Tools',
          tools_list: ['Apache Kafka', 'RabbitMQ', 'Amazon SNS'],
          dist_example_title: 'Example',
          dist_example_p: 'A payment application that publishes payment confirmation events, which are consumed by different services to update inventory, notify the user, and generate invoices.',
          sim_title: 'Interactive Simulator',
          sim_desc: 'Try our interactive Event Sourcing simulation to better understand how events are recorded and processed in a distributed system.',
          sim_cta: 'Access Simulator'
        },
        scalability: {
          overview: {
            title: 'Design for Scalability',
            intro: 'Scalability is the ability of a system to handle increased workload either by adding hardware capacity or distributing the load across multiple instances.',
            tiles: {
              horizontal_title: 'Horizontal Scalability',
              horizontal_desc: 'Distribute load across multiple servers by adding more machines.',
              vertical_title: 'Vertical Scalability',
              vertical_desc: 'Increase resources on a single server such as RAM, CPU, or storage.',
              consistency_title: 'Data Consistency',
              consistency_desc: 'Ensure that all copies of data are synchronized across servers.',
              latency_title: 'Latency',
              latency_desc: 'Manage delays in delivering data or responses across the system.',
              failover_title: 'Failover',
              failover_desc: 'Automatically switch to a backup system in case of failure.'
            },
            sim_cta: 'Explore Scalability Simulator'
          },
          horizontal: {
            title: 'Horizontal Scalability (Scale-Out)',
            intro: 'A method that adds more servers to work together, dividing the workload among them.',
            how_title: 'How It Works',
            how_p: 'It is like using multiple cars to transport passengers instead of relying on a single larger car. This approach is common in modern systems, especially in cloud environments.',
            example_title: 'Practical Example',
            example_p: 'A video streaming network that started with a single server sees global audience growth. To meet demand, it adds servers in various regions, sharing the load and delivering content faster, even to distant users.',
            advantages_title: 'Advantages',
            advantages: [
              'Unlimited Scalability: You can add more servers as needed',
              'High Availability: If one server fails, others continue operating',
              'Cost-Effective: Can use simpler, commodity hardware'
            ],
            considerations_title: 'Important Considerations',
            considerations: [
              'Data Distribution: Plan how data will be distributed and synchronized',
              'Complexity: Requires coordination and load balancing mechanisms',
              'Consistency: Keeping data consistent across servers is challenging'
            ],
            best_practices_title: 'Best Practices',
            best_practices: [
              'Automation: Automate adding/removing servers from the cluster',
              'Monitoring: Implement robust monitoring to identify bottlenecks and issues',
              'Redundancy: Maintain appropriate redundancy to ensure high availability'
            ],
            sim_cta: 'Explore Scalability Simulator'
          },
          vertical: {
            title: 'Vertical Scalability (Scale-Up)',
            intro: 'A strategy that improves the performance of a single server by adding more resources such as RAM, storage, or faster processors.',
            how_title: 'How It Works',
            how_p: 'It is like replacing a small car with a bigger one to carry more passengers. While simple to implement, it has a physical limit: a server can only be upgraded up to a point before reaching maximum capacity.',
            example_title: 'Practical Example',
            example_p: 'An online store initially using a basic server upgrades to a more powerful one due to increased traffic. This solves the problem in the short term, but as visitors continue to grow, this approach may no longer suffice.',
            advantages_title: 'Advantages',
            advantages: [
              'Simplicity: Easy to implement and manage',
              'Lower Complexity: No changes to system architecture',
              'Quick Solution: Ideal for immediate performance issues'
            ],
            limitations_title: 'Limitations',
            limitations: [
              'Physical Limit: There is a maximum to how much a single server can be improved',
              'Cost: More powerful hardware generally costs exponentially more',
              'Single Point of Failure: If the server fails, the entire system is down'
            ],
            when_title: 'When to Use',
            when: [
              'Small Applications: Moderate traffic and predictable growth',
              'Temporary Solution: Quick fix for performance problems',
              'Monolithic Systems: Apps not designed for distribution'
            ],
            sim_cta: 'Explore Scalability Simulator'
          },
          latency: {
            title: 'Latency',
            intro: 'Latency is the delay in delivering data or responses within a system. In distributed systems, especially those across multiple regions, latency can increase due to physical distance or communication complexity.',
            impact_title: 'The Impact of Latency',
            impact_p: 'Latency can significantly affect user experience and overall system performance. Even small delays may have a large impact on user satisfaction and business metrics.',
            types_title: 'Types of Latency',
            types: [
              'Network Latency: Time required for a data packet to travel between two points on the network.',
              'Processing Latency: Time the system takes to process a request and produce a response.',
              'Storage Latency: Time required to read or write data in a storage system.'
            ],
            strategies_title: 'Optimization Strategies',
            strategies: [
              'CDN: Use content delivery networks to bring data closer to users.',
              'Caching: Store frequently accessed data closer to the user.',
              'Edge Computing: Process data near the source to reduce delay.'
            ],
            best_title: 'Best Practices',
            best: [
              'Monitoring: Implement detailed metrics to identify and resolve latency bottlenecks.',
              'Code Optimization: Keep code efficient to minimize processing time.',
              'Geographic Distribution: Distribute resources in different regions to serve users locally.'
            ],
            sim_cta: 'Explore Scalability Simulator'
          },
          failover: {
            title: 'Failover in Distributed Systems',
            intro: 'Failover is a critical strategy to ensure service continuity in case of failures, allowing automatic recovery and minimizing downtime.',
            what_is_title: 'What is Failover?',
            what_is_p: 'Failover is an automatic recovery mechanism that transfers operations from a failed system to a backup or secondary system. The goal is to keep the service available even when failures occur.',
            types_title: 'Types of Failover',
            types: [
              'Active-Passive: A primary system handles requests while a secondary waits on standby; if the primary fails, the secondary takes over.',
              'Active-Active: Multiple systems handle requests simultaneously; if one fails, others absorb its load.',
              'Cascading Failover: Multiple backup levels where each system takes over in a predefined order when failures occur.'
            ],
            components_title: 'Essential Components',
            components: [
              'Health Monitoring (Health Check)',
              'Failure Detection',
              'Transition Mechanism',
              'State Synchronization',
              'Automatic Recovery'
            ],
            real_world_title: 'Real-World Example',
            real_world_p: 'A streaming service implements failover across multiple regions. If a datacenter in Asia fails due to a natural disaster, traffic is automatically redirected to servers in Europe or America, keeping the service available.',
            best_title: 'Best Practices',
            best: [
              'Regularly test failover mechanisms',
              'Automate detection and transition processes',
              'Maintain detailed logs of failover events',
              'Configure appropriate timeouts and thresholds',
              'Implement real-time monitoring',
              'Document failover and recovery procedures'
            ],
            explore_title: 'Explore in Practice',
            explore_p: 'Try different failover strategies and see how they affect system availability.',
            explore_cta: 'Open Simulator'
          },
          


        },
        
        consistency_strategies: {
          index: {
            title: 'Consistency Strategies',
            subtitle: 'Explore different mechanisms to ensure consistency in distributed systems',
            info: 'Consistency is one of the main challenges in distributed systems. Learn how different strategies help keep data ordered and coherent.',
            cards: {
              two_phase_commit_title: 'Two-Phase Commit',
              two_phase_commit_desc: 'Ensure consistency in distributed transactions using the Two-Phase Commit (2PC) protocol.',
              consensus_title: 'Consensus Strategy',
              consensus_desc: 'Understand how distributed systems reach agreement in critical decisions using consensus protocols.',
              lamport_title: 'Lamport Logical Clocks',
              lamport_desc: 'Learn how Lamport timestamps order distributed events and maintain causal consistency.'
            },
            coming_soon_title: 'Coming Soon',
            coming_soon_p: 'More consistency strategies will be added soon, including:',
            coming_soon_items: ['Vector Clocks', 'Eventual Consistency']
          },
          // Consensus Strategy (EN)
          consensus: {
            title: 'Consensus Strategies',
            intro: 'Understand how distributed systems reach agreement in critical decisions using consensus protocols.',
            what_is_title: 'What is Consensus?',
            what_is_p: 'Consensus is one of the fundamental problems in distributed systems. It is the process by which a group of nodes agrees on a common value or decision, even in the presence of failures.',
            raft_title: 'Raft Protocol',
            raft_intro: 'Raft is a consensus protocol designed to be more understandable than Paxos. It splits the problem into three independent subproblems:',
            raft_points: ['Leader election', 'Log replication', 'Safety guarantees'],
            raft_example_title: 'Practical Example',
            raft_example_p: 'In a cluster of 5 nodes running Raft, when the leader fails, the followers start a new election after a timeout. The node that receives the majority of votes becomes the new leader.',
            paxos_title: 'Paxos Protocol',
            paxos_intro: 'Paxos is a consensus protocol that ensures consistency in a distributed system even when nodes may fail or messages may be lost.',
            paxos_how_title: 'How It Works',
            paxos_phases_intro: 'The protocol operates in two main phases:',
            paxos_phases: ['Phase 1: Prepare/Promise', 'Phase 2: Propose/Accept'],
            zookeeper_title: 'ZooKeeper',
            zookeeper_intro: 'ZooKeeper is a coordination service for distributed systems that implements its own consensus protocol (ZAB - ZooKeeper Atomic Broadcast).',
            zookeeper_features_title: 'Characteristics',
            zookeeper_features: ['Total ordering of updates', 'Atomicity', 'Sequential consistency', 'Durability'],
            pros_cons_title: 'Advantages and Disadvantages',
            advantages_title: 'Advantages',
            advantages_list: ['Strong consistency', 'Fault tolerance', 'Automatic recovery', 'Ordering guarantees'],
            disadvantages_title: 'Disadvantages',
            disadvantages_list: ['Higher latency', 'Implementation complexity', 'Communication overhead', 'Quorum requirements'],
            cta_title: 'Try It in Practice',
            cta_p: 'Use our interactive simulator to better understand how consensus protocols work in different scenarios.',
            cta_button: 'Open Simulator'
          },
          // Consensus Simulator (EN)
          consensus_simulator: {
            title: 'Consensus Simulator',
            controls: {
              protocol_label: 'Protocol:',
              options: { raft: 'Raft', paxos: 'Paxos', zookeeper: 'ZooKeeper' },
              start: 'Start',
              pause: 'Pause',
              restart: 'Restart',
              speed_label: 'Speed:',
              speed_opts: { slow: 'Slow', normal: 'Normal', fast: 'Fast' },
              show_explanations: 'Show Explanations',
              hide_explanations: 'Hide Explanations'
            },
            step_prefix: 'Step',
            cluster_vis_title: 'Cluster Visualization',
            roles: {
              follower: 'Follower', candidate: 'Candidate', leader: 'Leader',
              proposer: 'Proposer', acceptor: 'Acceptor', learner: 'Learner', participant: 'Participant'
            },
            labels: {
              node_label: 'Node',
              term_label: 'Term',
              log_label: 'Log',
              proposal_label: 'Proposal',
              promised_label: 'Promised',
              accepted_label: 'Accepted',
              value_label: 'Value',
              learned_value_label: 'Learned Value',
              zxid_label: 'zxid',
              data_label: 'Data',
              watching_label: 'Watching: {{path}}',
              last_event_label: 'Last Event: {{event}}'
            },
            legend: {
              legend_title: 'Legend:',
              node_states_title: 'Node States:',
              message_types_title: 'Message Types:'
            },
            messages: {
              vote_request: 'Vote Request',
              vote_response: 'Vote Response',
              log_replication: 'Log Replication',
              prepare: 'Prepare',
              promise: 'Promise',
              propose: 'Propose',
              accept: 'Accept',
              watch: 'Watch',
              replication: 'Replication',
              notification: 'Notification'
            },
            progress_label: 'Progress: {{percent}}%'
          },
          // Lamport Timestamps Page (EN)
          lamport_timestamps: {
            title: 'Lamport Logical Clocks',
            intro: 'Understand how Lamport timestamps establish order among distributed events.',
            overview_title: 'Overview',
            problem_title: 'The Problem',
            problem_p1: 'In distributed systems, there is no global clock that all processes can consult. Each process has its own local clock, which may drift from the others.',
            solution_title: 'The Solution',
            solution_p1: 'Lamport logical clocks establish a partial order of events based on the "happened-before" relation, enabling determination of causality among distributed events.',
            how_title: 'How It Works',
            basic_rules_title: 'Basic Rules',
            basic_rules: [
              'Each process maintains a counter that is incremented on local events',
              'When sending a message, a process includes its current timestamp',
              'When receiving a message, a process sets its counter to max(local, received) + 1'
            ],
            properties_title: 'Properties',
            properties: [
              'If event A caused event B, then timestamp(A) < timestamp(B)',
              'If timestamp(A) < timestamp(B), then A may have caused B',
              'If timestamp(A) = timestamp(B), then A and B are concurrent'
            ],
            applications_title: 'Applications',
            use_cases_title: 'Use Cases',
            use_cases: [
              'Ordering messages in distributed messaging systems',
              'Detecting race conditions in concurrent systems',
              'Maintaining consistency in distributed databases',
              'Synchronizing state in multiplayer games'
            ],
            limitations_title: 'Limitations',
            limitations: [
              'Do not capture concurrency relations (events that happen in parallel)',
              'Do not provide an absolute global time',
              'May yield different orderings in different system executions'
            ],
            example_title: 'Practical Example',
            chat_system_title: 'Distributed Chat System',
            chat_intro: 'In a distributed chat system, Lamport timestamps can be used to:',
            chat_points: [
              'Order messages from different users',
              'Ensure replies appear after original messages',
              'Detect and resolve edit conflicts'
            ],
            cta_title: 'Try It in Practice',
            cta_p: 'Use our interactive simulator to better understand how Lamport logical clocks work in different scenarios.',
            cta_button: 'Open Simulator'
          },
          // Lamport Timestamps Simulator (EN)
          lamport_timestamps_simulator: {
            title: 'Lamport Timestamps Simulator',
            subtitle: 'Visualize how logical timestamps are updated in a distributed system',
            info: 'Add local events or send messages between processes to see how Lamport timestamps are updated. Observe how event ordering is preserved through logical clocks.',
            controls: { reset: 'Reset Simulation' },
            process_label: 'Process {{n}}',
            buttons: { local_event: 'Local Event', send_to: '→ {{target}}' },
            timeline: { clock_prefix: 't = ' },
            event_labels: { local: 'Local Event', send_prefix: '→ {{target}}', receive_prefix: '← {{source}}' },
            legend: { title: 'Legend', local: 'Local Event', sent: 'Message Sent', received: 'Message Received' }
          }
        },
        // Two-Phase Commit (EN)
        two_phase_commit: {
          title: 'Two-Phase Commit (2PC)',
          intro: 'Understand how the Two-Phase Commit protocol ensures consistency in distributed transactions.',
          overview_title: 'Overview',
          phase1_title: 'Phase 1: Prepare',
          phase1_p: 'The coordinator asks all participants to prepare for the transaction. Each participant checks whether it can perform the operation and replies to the coordinator.',
          phase2_title: 'Phase 2: Commit',
          phase2_p: 'Based on participant responses, the coordinator decides whether the transaction should be committed or aborted.',
          labels: {
            coordinator: 'Coordinator',
            participant: 'Participant {{n}}'
          },
          features_title: 'Characteristics',
          advantages_title: 'Advantages',
          advantages_list: [
            'Ensures strong data consistency',
            'Prevents partial transactions',
            'Transparent decision-making process',
            'Guaranteed atomicity',
            'Transaction isolation'
          ],
          limitations_title: 'Limitations',
          limitations_list: [
            'Blocking (participants wait for decision)',
            'Sensitive to coordinator failures',
            'Higher latency due to two phases',
            'Communication overhead',
            'Possibility of deadlocks'
          ],
          use_cases_title: 'Use Cases',
          banking_title: 'Banking Systems',
          banking_p: 'Transfers across accounts involving multiple banks or systems. Ensures money is not lost or duplicated.',
          ecommerce_title: 'E-commerce',
          ecommerce_p: 'Order processing that involves inventory, payment, and logistics. Ensures all steps complete successfully.',
          reservations_title: 'Reservations',
          reservations_p: 'Hotel, flight, or event reservation systems that must coordinate multiple resources simultaneously.',
          cta_title: 'Try It in Practice',
          cta_p: 'Use our interactive simulator to better understand how Two-Phase Commit works in different scenarios.',
          cta_button: 'Open Simulator'
        },
        // Two-Phase Commit Simulator (EN)
        two_phase_commit_simulator: {
          title: 'Two-Phase Commit Simulator',
          intro: 'This simulator demonstrates the Two-Phase Commit protocol in a distributed bank transfer. Configure bank responses by clicking them before starting the simulation.',
          controls: {
            start: 'Start',
            pause: 'Pause',
            simulation: 'Simulation',
            reset: 'Reset',
            speed_label: 'Speed:',
            speed_opts: { slow: 'Slow', normal: 'Normal', fast: 'Fast' }
          },
          nodes: {
            coordinator: 'Coordinator',
            bank_n: 'Bank {{n}}'
          },
          node_states: {
            idle: 'idle', preparing: 'preparing', prepared: 'prepared', committed: 'committed', aborted: 'aborted'
          },
          responses: { yes: 'yes', no: 'no' },
          config: {
            configure_response: 'Configure response:',
            approve: 'Approve',
            reject: 'Reject',
            status: 'Status:',
            will_approve: 'Will approve the transaction',
            will_reject: 'Will reject the transaction'
          },
          messages: {
            prepare_q: 'Prepare for transfer?',
            vote_yes: 'Yes, ready to commit',
            vote_no: 'No, resources unavailable',
            decision_commit: 'Commit: execute the transfer',
            decision_abort: 'Abort: cancel the operation',
            done: 'Operation completed successfully'
          },
          steps: {
            current_phase: 'Current Phase:',
            s0: 'Click the banks to configure their responses, then start the simulation',
            s1: "Phase 1: Coordinator sent 'prepare' to all participants",
            s2: 'Phase 1: Participants replied with their votes',
            s3: 'Phase 2: Coordinator made the final decision',
            s4: 'Simulation finished! You can reset to run again.'
          }
        },
        // Added synchronization pages (EN)
        synchronization: {
          title: 'Synchronization in Distributed Systems',
          intro: 'Synchronization is one of the fundamental challenges in distributed systems. It ensures that different processes or services coordinate their actions efficiently and safely.',
          key_concept_label: 'Key Concept',
          key_concept_text: 'Efficient synchronization is crucial to maintain consistency and avoid race conditions in distributed systems. However, it is important to balance synchronization with performance.',
          fundamentals: {
            title: 'Fundamentals',
            basics_title: 'Basic Concepts',
            basics_p: 'Synchronization in distributed systems involves several fundamental concepts that must be understood to implement efficient solutions.',
            mutual_exclusion: 'Mutual Exclusion',
            shared_resources: 'Shared Resources',
            shared_resources_desc: 'Guarantee exclusive access to resources',
            race_conditions: 'Race Conditions',
            race_conditions_desc: 'Prevent access conflicts',
            coordination: 'Coordination',
            consensus: 'Consensus',
            consensus_desc: 'Agreement among distributed processes',
            ordering: 'Ordering',
            ordering_desc: 'Sequencing of distributed events'
          },
          topics: {
            title: 'Topics',
            fundamentals_title: 'Fundamentals',
            fundamentals_p: 'Learn the basic concepts of synchronization using the classic Dining Philosophers problem.',
            badges: { mutual_exclusion: 'Mutual Exclusion', race_conditions: 'Race Conditions' },
            deadlocks_title: 'Deadlocks',
            deadlocks_p: 'Understand how to prevent and detect deadlocks in distributed systems.',
            deadlocks_badges: { prevention: 'Prevention', detection: 'Detection' },
            algorithms_title: 'Algorithms',
            algorithms_p: 'Explore different distributed synchronization algorithms.',
            algorithms_badges: { bakery: 'Bakery Algorithm', token_ring: 'Token Ring' }
          },
          best_practices: {
            title: 'Best Practices',
            design_impl_title: 'Design and Implementation',
            minimize_sync_label: 'Minimize Synchronization',
            minimize_sync_desc: 'Use synchronization only when necessary',
            granularity_label: 'Appropriate Granularity',
            granularity_desc: 'Choose the right level of synchronization',
            timeout_recovery_label: 'Timeout and Recovery',
            timeout_recovery_desc: 'Implement timeout and recovery mechanisms',
            monitoring_debugging_title: 'Monitoring and Debugging',
            detailed_logging_label: 'Detailed Logging',
            detailed_logging_desc: 'Keep detailed logs of synchronization operations',
            performance_metrics_label: 'Performance Metrics',
            performance_metrics_desc: 'Monitor synchronization impact on performance',
            deadlock_detection_label: 'Deadlock Detection',
            deadlock_detection_desc: 'Implement deadlock detection mechanisms'
          },
          next_steps: {
            title: 'Next Steps',
            deadlocks_title: 'Deadlocks',
            deadlocks_p: 'Learn more about how to identify, prevent, and resolve deadlocks in distributed systems.',
            deadlocks_badges: { detection: 'Detection', prevention: 'Prevention' },
            algorithms_title: 'Algorithms',
            algorithms_p: 'Explore different distributed synchronization algorithms and their applications.',
            algorithms_badges: { bakery: 'Bakery Algorithm', token_ring: 'Token Ring' }
          }
        },
        synchronization_fundamentals: {
          title: 'Synchronization Fundamentals',
          intro_p1: 'The Dining Philosophers problem is a classic example illustrating the fundamental challenges of synchronization in distributed systems.',
          intro_p2: 'We will explore how it helps us understand important concepts like mutual exclusion, deadlocks, and starvation.',
          key_concept_label: 'Key Concept',
          key_concept_text: 'The Dining Philosophers problem was proposed by Edsger Dijkstra in 1965 and remains an excellent tool to understand synchronization challenges in modern distributed systems.',
          illustration_title: 'Problem Illustration',
          philosophers: ['Plato', 'Aristotle', 'Kant', 'Socrates', 'Descartes'],
          statuses: { thinking: 'Thinking', eating: 'Eating', hungry: 'Hungry', waiting: 'Waiting' },
          legend: { thinking: 'Thinking', eating: 'Eating' },
          dining_title: 'The Dining Philosophers',
          illustration_caption: 'Five philosophers sit at a round table, each with a bowl of pasta and a fork between each pair. To eat, a philosopher needs to pick up two adjacent forks, but there are only five forks in total.',
          strategies_title: 'Synchronization Strategies',
          strategies: {
            naive: 'Naive: Philosophers simply try to pick up the left fork and then the right one. This easily leads to deadlock.',
            ordered: 'Ordered: Philosophers always pick up the fork with the smaller number first, preventing deadlocks.',
            waiter: 'Waiter: A "waiter" ensures only one philosopher at a time can attempt to pick up both forks.'
          },
          significance_title: 'Significance and Applications',
          significance_p1: 'The Dining Philosophers problem is more than an academic exercise—it models real challenges in modern distributed systems. Each philosopher represents a process or thread that needs to access shared resources (the forks) safely and efficiently.',
          significance_p2: 'In real systems, this problem appears in many scenarios: distributed databases managing concurrent transactions, distributed file systems controlling access to shared resources, or sensor networks coordinating data collection. Solving it is essential to ensure reliability and efficiency.',
          analogy_title: 'Analogy with Real Systems',
          analogy_points: ['Philosophers = Processes/Threads', 'Forks = Shared Resources', 'Eating = Executing Critical Operations', 'Thinking = Independent Processing'],
          modern_challenges_title: 'Modern Challenges',
          modern_challenges: ['Scalability in Distributed Systems', 'Fault Tolerance', 'Load Balancing', 'Fairness Guarantees'],
          problem_section: {
            title: 'The Problem',
            scenario_title: 'Scenario',
            items: { philosophers: '5 Philosophers', round_table: 'Sitting at a round table', forks: '5 Forks', forks_desc: 'One between each pair of philosophers', plate: '1 Plate', plate_desc: 'A bowl of pasta for each philosopher' },
            rules_title: 'Rules',
            rules: { two_forks: '2 Forks', two_forks_desc: 'Required to eat', one_fork_time: '1 Fork at a time', one_fork_time_desc: 'Per philosopher at a time', finite_time: 'Finite Time', finite_time_desc: 'To eat and think' }
          },
          challenges: {
            title: 'Challenges',
            deadlock_title: 'Deadlock',
            deadlock_p: 'If all philosophers pick up the left fork and wait for the right fork, none will be able to eat.',
            deadlock_badges: { circular_wait: 'Circular Wait', infinite_wait: 'Infinite Wait' },
            starvation_title: 'Starvation',
            starvation_p: 'Some philosophers may never get to eat if fork distribution is unfair.',
            starvation_badges: { starvation: 'Starvation', unfairness: 'Unfairness' }
          },
          solutions: {
            title: 'Solutions',
            deadlock_prevention_title: 'Deadlock Prevention',
            fork_ordering_label: 'Fork Ordering',
            fork_ordering_desc: 'Always pick up the fork with the smaller number first',
            timeout_label: 'Timeout',
            timeout_desc: 'Release forks if the second fork is not acquired in time',
            starvation_prevention_title: 'Starvation Prevention',
            priority_label: 'Priority',
            priority_desc: 'Prioritize philosophers who have not eaten for longer',
            fairness_label: 'Fairness Guarantee',
            fairness_desc: 'Implement fairness mechanisms in distribution'
          }
        },
        // Added DEADLOCKS page (EN)
        deadlocks: {
          title: 'Deadlocks in Distributed Systems',
          intro: 'Understand what deadlocks are, how they occur in distributed systems, and different strategies for prevention and detection.',
          key_concept_label: 'Key Concept',
          key_concept_text: 'Deadlocks occur when two or more processes are permanently blocked, each waiting for a resource held by another process.',
          conditions: {
            title: 'Conditions for Deadlock',
            items: {
              mutual_exclusion_title: 'Mutual Exclusion',
              mutual_exclusion_desc: 'Resources cannot be shared simultaneously among processes.',
              hold_and_wait_title: 'Hold and Wait',
              hold_and_wait_desc: 'Processes hold resources while waiting for others.',
              no_preemption_title: 'No Preemption',
              no_preemption_desc: 'Resources cannot be forcibly taken from a process.',
              circular_wait_title: 'Circular Wait',
              circular_wait_desc: 'There is a circular chain of processes waiting for resources.'
            }
          },
          prevention: {
            title: 'Deadlock Prevention',
            denial_title: 'Prevention by Denial',
            denial_desc: 'Deny one of the four necessary conditions for deadlock.',
            denial_list: [
              'Mutual Exclusion: Allow resource sharing',
              'Hold and Wait: Require allocation of all resources at once',
              'No Preemption: Allow resource preemption',
              'Circular Wait: Impose a total order on resources'
            ],
            avoidance_title: 'Prevention by Avoidance',
            avoidance_desc: 'Use system state information to avoid deadlocks.',
            avoidance_list: [
              'Banker\'s Algorithm',
              'Resource Allocation Graph',
              'Safe State Analysis'
            ]
          },
          detection: {
            title: 'Deadlock Detection',
            centralized_title: 'Centralized Detection',
            centralized_desc: 'A central coordinator monitors the system state and detects deadlocks.',
            distributed_title: 'Distributed Detection',
            distributed_desc: 'Each process participates in detection through message exchange.'
          },
          next_steps: {
            title: 'Next Steps',
            algorithms_title: 'Synchronization Algorithms',
            algorithms_desc: 'Explore specific algorithms for deadlock prevention.',
            simulator_title: 'Philosophers Simulator',
            simulator_desc: 'Try different deadlock prevention strategies.'
          }
        },
        // Added ALGORITHMS page (EN)
        algorithms: {
          title: 'Synchronization Algorithms',
          intro: 'There are several algorithms to ensure synchronization in distributed systems. Each has specific characteristics and ideal use cases.',
          key_concept_label: 'Key Concept',
          key_concept_text: 'The choice of synchronization algorithm depends on factors such as number of nodes, network latency, fault tolerance, and performance requirements.',
          bakery: {
            title: 'Bakery Algorithm',
            concept_title: 'Concept',
            concept_p: 'Based on a bakery where each customer receives a ticket number and is served in increasing order.',
            badges: { total_order: 'Total Order', fairness: 'Fairness' },
            demo_title: 'Interactive Demo',
            labels: { process: 'Process', ticket: 'Ticket', request_access: 'Request Access' }
          },
          token_ring: {
            title: 'Token Ring',
            concept_title: 'Concept',
            concept_p: 'A token circulates among processes in a logical ring, and only the process holding the token can access shared resources.',
            badges: { single_token: 'Single Token', circular_passing: 'Circular Passing' },
            demo_title: 'Interactive Demo',
            move_token: 'Move Token',
            labels: { process_prefix: 'P' }
          },
          ricart_agrawala: {
            title: 'Ricart-Agrawala',
            concept_title: 'Concept',
            concept_p: 'Based on logical timestamps, where processes request permission from all others before accessing shared resources.',
            badges: { timestamps: 'Timestamps', consensus: 'Consensus' },
            demo_title: 'Interactive Demo',
            labels: { process: 'Process', request_access: 'Request Access', ts_prefix: 'TS' }
          },
          comparison: {
            title: 'Comparison',
            bakery_title: 'Bakery Algorithm',
            token_ring_title: 'Token Ring',
            ricart_title: 'Ricart-Agrawala',
            advantages: 'Advantages',
            disadvantages: 'Disadvantages',
            bakery: { pros: 'Simple and fair', cons: 'High message complexity' },
            token_ring: { pros: 'Low message complexity', cons: 'Single point of failure' },
            ricart: { pros: 'Fault tolerant', cons: 'High latency' }
          }
        },
        availability: {
        
          index: {
            title: 'High Availability',
            intro: 'High availability is a system\'s ability to remain operational and accessible even under failures, ensuring service continuity through redundancy and automatic recovery.',
            cards: {
              replication_title: 'Replication',
              replication_desc: 'Keep synchronized copies of data/services across servers to ensure redundancy and load distribution.',
              failover_title: 'Failover',
              failover_desc: 'Automatic recovery mechanisms that detect failures and redirect traffic to backup systems.',
              zones_title: 'Availability Zones',
              zones_desc: 'Deploy across multiple zones to protect against localized infrastructure failures.',
              dr_title: 'Disaster Recovery',
              dr_desc: 'Plan and implement strategies to recover the system in catastrophic failures.',
              monitoring_title: 'Health Monitoring',
              monitoring_desc: 'Continuously monitor system health to detect and resolve issues early.',
              load_dist_title: 'Load Distribution',
              load_dist_desc: 'Distribute traffic across servers to avoid overload and maintain responsiveness.'
            },
            sim_cta: 'Explore High Availability Simulator'
          },
          replication: {
            title: 'Replication in Distributed Systems',
            intro: 'Replication is fundamental to ensure high availability and redundancy.',
            what_title: 'What is Replication?',
            what_p: 'Replication creates and maintains copies of data or services in multiple locations. This increases availability and redundancy, ensuring access even if a server fails.',
            types_title: 'Types of Replication',
            types: [
              'Synchronous Replication: All copies are updated before confirming the operation (strong consistency, higher latency).',
              'Asynchronous Replication: Updates propagate with delay (better performance, eventual consistency).',
              'Semi-synchronous Replication: Hybrid approach where at least one replica confirms before proceeding.'
            ],
            benefits_title: 'Benefits',
            benefits: [
              'High availability and fault tolerance',
              'Geographical distribution for lower latency',
              'Load balancing across replicas',
              'Backup and disaster recovery',
              'Read scalability'
            ],
            real_world_title: 'Real-World Example',
            real_world_p: 'A social network stores user photos on multiple servers worldwide. If one server fails, a replicated copy is available, preventing data loss and keeping the service online.',
            best_title: 'Best Practices',
            best: [
              'Choose replication type based on consistency needs',
              'Monitor replica health and status',
              'Implement conflict detection and resolution mechanisms',
              'Keep replication logs for audit and recovery',
              'Regularly test failover scenarios',
              'Consider geographic location of replicas'
            ],
            explore_title: 'Explore in Practice',
            explore_p: 'Try different replication strategies and see their impact on consistency and latency.',
            explore_cta: 'Open Simulator'
          },
          availability_zones: {
            title: 'Availability Zones',
            intro: 'Availability Zones are isolated data centers within a geographic region, designed to provide redundancy and high availability for critical applications.',
            how_works_title: 'How It Works',
            how_works_intro: 'Each availability zone is an independent data center with:',
            how_works_items: [
              'Independent and redundant power',
              'Independent cooling systems',
              'Dedicated network infrastructure',
              'High-speed connections between zones'
            ],
            how_works_outro: 'The zones are designed to be isolated from failures in other zones, but close enough to ensure low latency communication between them.',
            benefits_title: 'Benefits',
            benefits: [
              {
                title: 'Fault Isolation',
                description: 'Problems in one zone do not affect others, ensuring service continuity.'
              },
              {
                title: 'High Availability',
                description: 'Resource distribution across zones ensures the service remains available even with the failure of an entire zone.'
              },
              {
                title: 'Low Latency',
                description: 'High-speed connections between zones allow efficient data synchronization and load balancing.'
              }
            ],
            real_world_title: 'Real-World Example',
            real_world_example_title: 'Large E-commerce Platform',
            real_world_intro: 'An e-commerce platform distributes its application across three availability zones:',
            real_world_items: [
              'Zone A: Main application server',
              'Zone B: Active replica and primary database',
              'Zone C: Backup and secondary database'
            ],
            real_world_outro: 'If Zone A fails, traffic is automatically redirected to Zone B, while Zone C ensures no data is lost during the transition.',
            best_practices_title: 'Best Practices',
            best_practices: [
              {
                title: 'Smart Distribution',
                description: 'Distribute resources and data evenly across zones to maximize resilience.'
              },
              {
                title: 'Constant Monitoring',
                description: 'Implement real-time monitoring to detect and respond quickly to problems in any zone.'
              },
              {
                title: 'Regular Testing',
                description: 'Perform failover tests regularly to ensure transition between zones works as expected.'
              }
            ],
            simulator_title: 'Explore the Availability Zones Simulator',
            simulator_description: 'Experience in practice how availability zones work and how they respond to different failure scenarios.'
          },
          availability_zones_simulator: {
            title: 'Availability Zones Simulator',
            intro: 'Explore how availability zones work together to ensure high availability and fault tolerance.',
            controls: {
              request_rate_label: 'Request Rate (per second)',
              failure_chance_label: 'Failure Chance (%)',
              auto_failover_label: 'Auto Failover',
              start_simulation: 'Start Simulation',
              stop_simulation: 'Stop Simulation'
            },
            zone_status: {
              healthy: 'Healthy',
              degraded: 'Degraded',
              failed: 'Failed'
            },
            zone_info: {
              load: 'Load',
              active_servers: 'Active Servers',
              latency: 'Latency',
              simulate_failure: 'Simulate Failure',
              recover: 'Recover'
            },
            statistics: {
              title: 'Statistics',
              total_requests: 'Total Requests',
              success_rate: 'Success Rate'
            },
            recent_requests: {
              title: 'Recent Requests',
              completed: 'Completed',
              failed: 'Failed',
              processing: 'Processing',
              pending: 'Pending'
            }
          }
        },
        fault_tolerance: {
          title: 'Fault Tolerance',
          intro: 'Designing systems that can recover or continue operating in the face of failures is essential to maintain reliability and high availability.',
          example_label: 'Practical Example',
          strategy: {
            retries: {
              title: 'Retries',
              description: 'When an operation fails, the system attempts it again, increasing the chance of success in case of transient failures.',
              example: 'In an online shopping app, if order confirmation fails due to a network issue, the app automatically retries the request.'
            },
            circuit_breakers: {
              title: 'Circuit Breakers',
              description: 'Prevents cascading failures by detecting problems and temporarily stopping calls to a troubled service.',
              example: 'When an image server is overloaded, the circuit breaker blocks new requests for a while, allowing the server to recover.'
            },
            timeout: {
              title: 'Timeout',
              description: 'Defines a maximum time for an operation to complete, avoiding waiting indefinitely for a response.',
              example: 'When submitting a form, if the server does not respond within 30 seconds, the operation is canceled and an error message is shown.'
            },
            fallback: {
              title: 'Fallback',
              description: 'Provides an alternative when the primary operation fails, ensuring the system continues to function in a degraded mode.',
              example: 'In a maps app, if GPS fails, the system uses Wi‑Fi network location as an alternative to show an approximate position.'
            }
          }
        },
        retries: {
          title: 'Retries',
          intro: 'A fundamental strategy to handle transient failures in distributed systems, allowing failed operations to be retried automatically.',
          how_it_works: {
            title: 'How It Works',
            text: 'Imagine you are sending a message to a friend. Sometimes it does not arrive the first time due to network issues. What do you do? You try again. That is exactly what "Retry" does in computer systems.'
          },
          real_world_example: {
            title: 'Real-World Example',
            text: 'Think of an online shopping app. When you click "Buy", the app must confirm the order with a server. If the connection briefly fails, the app can retry a few times before showing an error.'
          },
          benefits: {
            title: 'Benefits',
            items: {
              resilience: { title: 'Higher Resilience', desc: 'Systems can automatically recover from transient failures.' },
              ux: { title: 'Better Experience', desc: 'Users do not have to repeat actions manually when failures occur.' },
              reliability: { title: 'Reliability', desc: 'Increases the success rate of operations over unstable networks.' }
            }
          },
          best_practices: {
            title: 'Best Practices',
            items: {
              backoff: { title: 'Exponential Backoff', desc: 'Gradually increase the interval between attempts to avoid overloading the system (e.g., 1s, 2s, 4s, 8s).' },
              limit: { title: 'Retry Limit', desc: 'Set a maximum number of attempts to avoid infinite loops and fail fast when necessary.' },
              idempotency: { title: 'Idempotency', desc: 'Ensure multiple attempts of the same operation do not cause unintended side effects.' }
            }
          },
          considerations: {
            title: 'Important Considerations',
            items: {
              failure_types: { title: 'Types of Failures', desc: 'Not all failures should be retried. Validation or authentication errors, for example, do not benefit from retries.' },
              impact: { title: 'Impact on the System', desc: 'Many concurrent retries can overload the system. Use circuit breakers together when needed.' }
            }
          },
          cta_simulator: 'Explore Retries Simulator'
        },
        circuit_breaker: {
          title: 'Circuit Breaker',
          intro: 'An essential strategy to prevent cascading failures in distributed systems, working similarly to an electrical circuit breaker.',
          how_it_works: {
            title: 'How It Works',
            p1: 'Imagine your home internet is having serious issues. You try to send a message several times, but it never goes through. Keeping at it only frustrates you and overloads the network. That is where the Circuit Breaker comes in.',
            p2: 'It works like the breaker in your house: when the current is too high, it shuts everything off to avoid damage. In software systems, when many calls fail, the Circuit Breaker blocks new attempts for a while.'
          },
          benefits: {
            title: 'Benefits',
            items: {
              cascade_prevention: { title: 'Cascading Failure Prevention', desc: 'Prevents failures in one service from affecting the whole system.' },
              auto_recovery: { title: 'Automatic Recovery', desc: 'Allows the system to naturally recover after failures.' },
              better_experience: { title: 'Better Experience', desc: 'Fail fast instead of keeping users waiting.' }
            }
          },
          real_world: {
            title: 'Real-World Example',
            text: 'A news site receives a traffic spike during a major event. The image server becomes overloaded and slows responses. The Circuit Breaker detects this and blocks image fetches for a few minutes. The site keeps working (without images) while the server recovers.'
          },
          states: {
            title: 'Circuit Breaker States',
            closed: { title: 'Closed (Normal)', desc: 'Normal operation; requests pass through while failures are monitored.' },
            open: { title: 'Open (Blocked)', desc: 'Too many failures detected; requests are blocked for a period.' },
            half_open: { title: 'Half-Open (Test)', desc: 'Allows a few requests to test if the system has recovered.' }
          },
          cta_simulator: 'Explore Circuit Breaker Simulator'
        },
        timeout: {
          title: 'Timeout',
          intro: 'A fundamental strategy to avoid slow or stuck operations from hurting user experience and overall system health.',
          how_it_works: {
            title: 'How It Works',
            p1: 'Imagine you place an order at a restaurant. If it takes too long, you will cancel and leave. Timeout works similarly.',
            p2: 'It defines a maximum time for an operation to complete. If that time is exceeded, the system assumes something is wrong and aborts the operation.'
          },
          benefits: {
            title: 'Benefits',
            items: {
              ux: { title: 'Better User Experience', desc: 'Prevents users from waiting indefinitely.' },
              freeing_resources: { title: 'Freeing Resources', desc: 'Releases system resources that could otherwise remain stuck.' },
              failure_prevention: { title: 'Failure Prevention', desc: 'Avoids problems in one service from impacting others.' }
            }
          },
          real_world: {
            title: 'Real-World Example',
            text: 'You are submitting a form online. If the server is slow or down, the submission may take too long. A 30s timeout cancels the request and shows an error instead of waiting forever.'
          },
          best_practices: {
            title: 'Best Practices',
            items: {
              proper_times: { title: 'Proper Timeouts', desc: 'Set realistic timeouts based on operation type and user expectations.' },
              clear_messages: { title: 'Clear Messages', desc: 'Tell the user what happened and what to do next.' },
              retry_combo: { title: 'Retry Strategy', desc: 'Combine timeouts with retries for resilience.' }
            }
          },
          cta_simulator: 'Explore Timeout Simulator'
        },
      },
      
     
     
      service_oriented: {
        title: 'Service-Oriented Design',
        intro: 'Explore different approaches for organizing services and their practical implications. Each architecture has its own trade-offs and ideal use cases.',
        sections: {
          advantages: 'Advantages',
          disadvantages: 'Disadvantages',
          example_title: 'Practical Example',
          diagram_title: 'Architecture Visualization',
          legend: { direct_call: 'Direct call', interface: 'Interface', api_events: 'API/Events' },
          module_labels: { deploy: 'Deploy', communication: 'Communication', database: 'Database' }
        },
        architectures: {
          monolithic: {
            name: 'Monolithic',
            description: 'All features in a single codebase with strong coupling between modules.',
            advantages: [
              'Simple initial development',
              'Less overhead in component communication',
              'Single and simple deploy',
              'Easier end-to-end testing',
              'Efficient resource sharing'
            ],
            disadvantages: [
              'Hard to scale specific parts of the system',
              'Any change requires a full redeploy',
              'Can become complex as it grows',
              'High coupling between modules',
              'Difficult maintenance with large teams'
            ],
            example: 'A simple e-commerce app where catalog, users, and order processing are all in a single codebase.',
            modules: {
              auth: { name: 'Authentication', details: { deployment: 'Single deploy for the whole application', communication: 'Direct function calls', database: 'Shared database' } },
              orders: { name: 'Orders', details: { deployment: 'Single deploy for the whole application', communication: 'Direct function calls', database: 'Shared database' } },
              users: { name: 'Users', details: { deployment: 'Single deploy for the whole application', communication: 'Direct function calls', database: 'Shared database' } }
            }
          },
          modular: {
            name: 'Modular Monolith',
            description: 'Code organized into well-defined modules with clear boundaries, still deployed as a single unit.',
            advantages: [
              'Organized, modular code with clear boundaries',
              'Easier migration path to microservices',
              'Lower operational complexity than microservices',
              'Good balance between simplicity and organization',
              'Allows gradual evolution of the architecture'
            ],
            disadvantages: [
              'Requires discipline to maintain module boundaries',
              'Scalability still limited by a single unit',
              'Need for team coordination',
              'Temptation to break module boundaries',
              'Deploy is still coupled'
            ],
            example: 'An e-commerce app split into independent modules (catalog, orders, users), each with its own business rules and data, but deployed together as a single application.',
            modules: {
              auth: { name: 'Auth Module', details: { deployment: 'Single deploy, independent modules', communication: 'Well-defined interfaces', database: 'Separate schema in shared database' } },
              orders: { name: 'Orders Module', details: { deployment: 'Single deploy, independent modules', communication: 'Well-defined interfaces', database: 'Separate schema in shared database' } },
              users: { name: 'Users Module', details: { deployment: 'Single deploy, independent modules', communication: 'Well-defined interfaces', database: 'Separate schema in shared database' } }
            }
          },
          microservices: {
            name: 'Microservices',
            description: 'Independent services communicating over the network, each with its own deploy and database.',
            advantages: [
              'Flexibility to scale specific parts of the system',
              'Higher modularity and easier maintenance',
              'Each team can focus on a single service',
              'Technology freedom per service',
              'Independent and faster deploys'
            ],
            disadvantages: [
              'Increased orchestration complexity',
              'Requires robust infrastructure',
              'Data consistency challenges',
              'Higher latency in communication',
              'Higher operational costs'
            ],
            example: 'An e-commerce app where payment, inventory, and user management are implemented as separate microservices.',
            modules: {
              auth: { name: 'Auth Service', details: { deployment: 'Independent deploy', communication: 'REST/gRPC API', database: 'Own database' } },
              orders: { name: 'Orders Service', details: { deployment: 'Independent deploy', communication: 'REST/gRPC API', database: 'Own database' } },
              users: { name: 'Users Service', details: { deployment: 'Independent deploy', communication: 'REST/gRPC API', database: 'Own database' } }
            }
          }
        }
      },
      canary_deployment: {
        title: 'Canary Deployment',
        intro: 'A progressive deployment strategy that reduces risk by gradually exposing a new version to a small percentage of users before rolling out to everyone.',
        how_it_works: {
          title: 'How It Works',
          text: 'Canary deployment works by routing a small percentage of production traffic to the new version while the majority continues using the stable version. This allows teams to monitor real-world behavior and catch issues before they affect all users.'
        },
        origin: {
          title: 'Origin of the Name',
          text: 'The name comes from the practice of coal miners bringing canaries into mines. If dangerous gases were present, the canary would be affected first, alerting miners to danger. Similarly, canary deployments detect problems early with minimal user impact.'
        },
        diagram: {
          users: 'Users',
          router: 'Router'
        },
        phases: {
          title: 'Deployment Phases',
          deploy: {
            title: 'Deploy Canary',
            desc: 'Deploy the new version alongside the existing stable version without routing any traffic to it yet.'
          },
          route: {
            title: 'Route Traffic',
            desc: 'Begin routing a small percentage (e.g., 5-10%) of traffic to the canary version.'
          },
          monitor: {
            title: 'Monitor & Analyze',
            desc: 'Monitor key metrics like error rates, latency, and business KPIs. Compare canary vs stable performance.'
          },
          expand: {
            title: 'Expand or Rollback',
            desc: 'If metrics are healthy, gradually increase canary traffic. If problems are detected, immediately rollback.'
          }
        },
        benefits: {
          title: 'Benefits',
          items: {
            risk_reduction: {
              title: 'Reduced Risk',
              desc: 'Issues affect only a small percentage of users, minimizing blast radius.'
            },
            quick_rollback: {
              title: 'Quick Rollback',
              desc: 'Problems can be detected and rolled back before they impact all users.'
            },
            real_testing: {
              title: 'Real-World Testing',
              desc: 'Test with actual production traffic and user behavior, not just synthetic tests.'
            },
            gradual_rollout: {
              title: 'Gradual Confidence',
              desc: 'Build confidence in the release by progressively increasing exposure.'
            }
          }
        },
        challenges: {
          title: 'Challenges',
          items: {
            complexity: {
              title: 'Infrastructure Complexity',
              desc: 'Requires sophisticated traffic routing, load balancing, and deployment automation.'
            },
            monitoring: {
              title: 'Monitoring Requirements',
              desc: 'Needs robust observability to compare canary and stable versions effectively.'
            },
            db_compat: {
              title: 'Database Compatibility',
              desc: 'Schema changes must be backward compatible since both versions run simultaneously.'
            }
          }
        },
        vs_blue_green: {
          title: 'Canary vs Blue-Green',
          aspect: 'Aspect',
          canary: 'Canary',
          blue_green: 'Blue-Green',
          traffic: 'Traffic',
          traffic_canary: 'Gradual',
          traffic_bg: 'All-at-once',
          risk: 'Risk',
          risk_canary: 'Lower',
          risk_bg: 'Higher',
          rollback: 'Rollback',
          rollback_canary: 'Instant',
          rollback_bg: 'Instant'
        },
        cta_simulator: 'Explore Canary Simulator'
      },
      coupling: {
        title: 'Coupling in Distributed Systems',
        intro: 'Coupling measures how tightly components in a system are connected or dependent. In distributed systems, its type and level have a strong impact on flexibility, maintainability, and resilience.',
        key_concept_label: 'Key Concept',
        key_concept_text: 'Lower coupling increases flexibility and maintainability, but extremely low coupling can add complexity. Balance is essential.',
        types_title: 'Types of Coupling',
        static_title: 'Static Coupling',
        characteristics_title: 'Characteristics',
        advantages_title: 'Advantages',
        disadvantages_title: 'Disadvantages',
        example_static_title: 'Static Coupling Example',
        dynamic_title: 'Dynamic Coupling',
        example_dynamic_title: 'Dynamic Coupling Example',
        service_discovery_title: 'Service Discovery',
        service_discovery_intro: 'Service Discovery is a fundamental pattern to enable dynamic coupling in distributed systems. It lets services find and communicate with each other without prior knowledge of locations.',
        components_title: 'Main Components',
        components: { registry: 'Service Registry', health: 'Health Checking', dns: 'Dynamic DNS' },
        tools_title: 'Popular Tools',
        best_practices_title: 'Best Practices',
        design_arch_title: 'Design & Architecture',
        implementation_title: 'Implementation',
        tradeoffs_title: 'Trade-offs and Considerations',
        real_world_title: 'Real-World Examples'
      },
      orchestration_vs_choreography: {
        title: 'Orchestration vs Choreography',
        intro: 'Understand the differences between Orchestration and Choreography patterns in distributed systems.',
        overview_title: 'Overview',
        orchestration_title: 'Orchestration',
        orchestration_p: 'A central orchestrator controls the workflow, coordinating interactions between services. Like a conductor, it dictates what each service should do and when.',
        choreography_title: 'Choreography',
        choreography_p: 'Services interact independently by reacting to events without a central controller. Like a dance, each participant knows their steps and reacts to others.',
        comparison_title: 'Detailed Comparison',
        examples_title: 'Usage Examples',
        when_to_use_title: 'When to Use Each Pattern',
        use_orchestration_when: 'Use Orchestration When:',
        use_choreography_when: 'Use Choreography When:',
        points_orchestration: [
          'Central controller (orchestrator)',
          'Explicit workflow',
          'Easier to understand and debug',
          'Less flexible to change',
          'Single point of failure',
          'More coupling'
        ],
        points_choreography: [
          'No central controller',
          'Implicit workflow',
          'Harder to understand',
          'More flexible to change',
          'No single point of failure',
          'Less coupling'
        ],
        use_orchestration_when_list: [
          'The workflow is complex and needs central coordination',
          'You need clear visibility of the process',
          'The process is stable and rarely changes',
          'You need full control over the flow',
          'The process is sequential and dependent'
        ],
        use_choreography_when_list: [
          'Services are independent and can evolve separately',
          'You need high scalability',
          'The process is dynamic and changes frequently',
          'You want to reduce coupling between services',
          'Events can be processed in parallel'
        ],
        examples: {
          orchestration_order_processing: 'Order Processing',
          choreography_notification_system: 'Notification System'
        },
        labels: {
          orchestrator: 'Orchestrator',
          service_a: 'Service A',
          service_b: 'Service B',
          service_c: 'Service C',
          service_d: 'Service D',
          start: 'Start',
          process: 'Process',
          end: 'End',
          order_created: 'Order Created',
          email: 'Email',
          sms: 'SMS',
          analytics: 'Analytics',
          logs: 'Logs'
        }
      },
      monitoring_maintenance: {
        main: {
          title: 'Monitoring and Maintenance of Distributed Systems',
          intro_p1: 'Monitoring and maintenance are critical to ensure the health, performance, and reliability of distributed systems. An effective strategy combines observability with proactive maintenance practices.',
          key_concept_label: 'Key Concept',
          key_concept_text: 'Observability in distributed systems is built on three pillars: metrics, logs, and traces. Together, they provide a complete view of the system\'s state and behavior.',
          pillars_title: 'The Three Pillars of Observability',
          pillars: {
            metrics: {
              title: 'Metrics',
              items: ['Numerical data over time', 'CPU, memory, latency, throughput', 'Aggregations and trends', 'Basis for alerts and dashboards']
            },
            logs: {
              title: 'Logs',
              items: ['Event records', 'Debugging and audit', 'Detailed context', 'Action history']
            },
            traces: {
              title: 'Traces',
              items: ['Request flow', 'Service dependencies', 'End-to-end performance', 'Problem diagnosis']
            }
          },
          golden_signals_title: 'Essential Metrics (Golden Signals)',
          use_method_title: 'USE Method',
          use_method_p: 'Utilization, Saturation, and Errors — a method for resource performance analysis.',
          use_method_items: [
            { title: 'Utilization', desc: 'Percentage of time the resource is busy' },
            { title: 'Saturation', desc: 'Degree of resource overload' },
            { title: 'Errors', desc: 'Failure rate of the resource' }
          ],
          red_method_title: 'RED Method',
          red_method_p: 'Rate, Errors, and Duration — focused on request and service metrics.',
          red_method_items: [
            { title: 'Rate', desc: 'Requests per second' },
            { title: 'Errors', desc: 'Failure rate of requests' },
            { title: 'Duration', desc: 'Request response time' }
          ],
          tools_title: 'Monitoring Tools',
          tools: {
            metrics_title: 'Metrics',
            metrics_items: [
              { name: 'Prometheus', desc: 'Metrics collection and storage' },
              { name: 'Grafana', desc: 'Visualization and dashboards' },
              { name: 'Datadog', desc: 'Monitoring as a service' }
            ],
            logs_title: 'Logs',
            logs_items: [
              { name: 'ELK Stack', desc: 'Elasticsearch, Logstash, Kibana' },
              { name: 'Graylog', desc: 'Centralized log management' },
              { name: 'Splunk', desc: 'Advanced log analytics' }
            ],
            tracing_title: 'Tracing',
            tracing_items: [
              { name: 'Jaeger', desc: 'Open-source distributed tracing' },
              { name: 'Zipkin', desc: 'Latency tracking' },
              { name: 'New Relic', desc: 'APM and tracing as a service' }
            ]
          },
          best_practices_title: 'Best Practices',
          monitoring_title: 'Monitoring',
          monitoring_items: [
            { title: 'Proactive Monitoring', desc: 'Identify issues before they impact users' },
            { title: 'Meaningful Alerts', desc: 'Configure alerts that truly importam' },
            { title: 'Automation', desc: 'Automate responses to common issues' }
          ],
          maintenance_title: 'Maintenance',
          maintenance_items: [
            { title: 'Preventive Maintenance', desc: 'Schedule regular maintenance' },
            { title: 'Documentation', desc: 'Keep documentation up to date' },
            { title: 'Backup and Recovery', desc: 'Implement and test recovery plans' }
          ],
          slo_title: 'Service Level Objectives',
          sli_card: { title: 'SLI', desc: 'Service Level Indicator', items: ['Specific metrics', 'Latency', 'Availability', 'Error rate'] },
          slo_card: { title: 'SLO', desc: 'Service Level Objective', items: ['Targets for SLIs', '99.9% uptime', 'Latency < 200ms', 'Error rate < 0.1%'] },
          sla_card: { title: 'SLA', desc: 'Service Level Agreement', items: ['Formal contract', 'Consequences', 'Compensations', 'Guarantees'] }
        },
        metrics: {
          title: 'Metrics and KPIs in Distributed Systems',
          intro_p1: 'Metrics and KPIs (Key Performance Indicators) are fundamental to understand behavior, performance, and health of distributed systems. They provide quantitative insights for data-driven decisions.',
          key_concept_label: 'Key Concept',
          key_concept_text: 'Effective metrics should be SMART: Specific, Measurable, Achievable, Relevant, and Time-bound.',
          categories_title: 'Core Metric Categories',
          categories: {
            system_title: 'System Metrics',
            system_items: [
              { title: 'CPU Utilization', desc: 'Percentage of CPU usage per service' },
              { title: 'Memory Usage', desc: 'RAM and virtual memory consumption' },
              { title: 'Disk I/O', desc: 'Read/write rate and disk latency' }
            ],
            app_title: 'Application Metrics',
            app_items: [
              { title: 'Throughput', desc: 'Requests processed per second' },
              { title: 'Latency', desc: 'Request response time' },
              { title: 'Error Rate', desc: 'Percentage of failed requests' }
            ]
          },
          perf_title: 'Performance Metrics',
          latency_card: {
            title: 'Latency',
            percentiles_title: 'Percentiles',
            percentiles_items: ['P50 (Median): < 100ms', 'P90: < 200ms', 'P99: < 500ms'],
            components_title: 'Components',
            components_items: ['Network Time', 'Processing Time', 'Queue Time']
          },
          throughput_card: {
            title: 'Throughput',
            measures_title: 'Measures',
            measures_items: ['RPS (Requests per Second)', 'TPS (Transactions per Second)', 'QPS (Queries per Second)'],
            capacity_title: 'Capacity',
            capacity_items: ['Peak Load', 'Sustained Load', 'Burst Capacity']
          },
          business_kpis_title: 'Business KPIs',
          availability_card: { title: 'Availability', items: ['Uptime', 'MTBF (Mean Time Between Failures)', 'MTTR (Mean Time To Recovery)', 'Error Budget'] },
          quality_card: { title: 'Quality', items: ['Success Rate', 'Error Rate', 'Data Quality', 'User Satisfaction'] },
          cost_card: { title: 'Cost', items: ['Infrastructure Cost', 'Cost per Request', 'Resource Utilization', 'ROI'] },
          prom_title: 'Implementation with Prometheus',
          prom_desc: 'Example of metrics configuration using Prometheus and PromQL:',
          prom_outro: 'These metrics can be visualized in Grafana dashboards for real-time monitoring.',
          best_practices_title: 'Best Practices',
          collect_title: 'Metrics Collection',
          collect_items: [{ title: 'Standardization', desc: 'Use consistent naming conventions' }, { title: 'Granularity', desc: 'Balance detail and overhead' }, { title: 'Aggregation', desc: 'Set appropriate aggregation windows' }],
          viz_title: 'Visualization',
          viz_items: [{ title: 'Dashboards', desc: 'Organize related metrics' }, { title: 'Alerts', desc: 'Configure meaningful thresholds' }, { title: 'Correlation', desc: 'Relate metrics for analysis' }]
        },
        logs: {
          title: 'Logs and Tracing in Distributed Systems',
          intro_p1: 'Logs and tracing are essential to understand behavior, debug issues, and maintain observability. They provide detailed insights into execution flow and system state.',
          key_concept_label: 'Key Concept',
          key_concept_text: 'In distributed systems, logs should be treated as event streams, centralized and correlated to provide a complete system view.',
          types_title: 'Log Types',
          app_logs_title: 'Application Logs',
          app_logs_items: ['Business events', 'Execution flow', 'Errors and exceptions', 'User actions'],
          sys_logs_title: 'System Logs',
          sys_logs_items: ['Startup/shutdown', 'Resource usage', 'System events', 'Hardware issues'],
          sec_logs_title: 'Security Logs',
          sec_logs_items: ['Access attempts', 'Permission changes', 'Audit events', 'Security alerts'],
          structured_title: 'Structured Logging',
          structured_desc: 'Structured logging treats logs as data objects rather than plain text, enabling easier analysis and search.',
          benefits_title: 'Benefits',
          benefits_items: [{ title: 'Searchability', desc: 'Enables complex searches and filters' }, { title: 'Analysis', desc: 'Allows aggregations and visualizations' }, { title: 'Standardization', desc: 'Consistent format across services' }],
          example_title: 'Example',
          aggregation_title: 'Log Aggregation',
          components_title: 'Components',
          components_items: [
            { title: 'Collectors', desc: 'Agents collecting logs from different sources' },
            { title: 'Processors', desc: 'Filter, transform and enrich logs' },
            { title: 'Storage', desc: 'Distributed system for persistence' },
            { title: 'Interface', desc: 'UI for search and analysis' }
          ],
          elk_title: 'ELK Stack',
          elk_items: [
            { title: 'Elasticsearch', desc: 'Distributed storage and search for logs' },
            { title: 'Logstash', desc: 'Log processing pipeline' },
            { title: 'Kibana', desc: 'Visualization and analysis of logs' }
          ],
          tracing_title: 'Distributed Tracing',
          tracing_desc: 'Distributed tracing tracks a request across multiple services, providing end-to-end visibility.',
          concepts_title: 'Concepts',
          concepts_items: [
            { title: 'Trace', desc: 'Represents an end-to-end transaction' },
            { title: 'Span', desc: 'Unit of work within a trace' },
            { title: 'Context', desc: 'Metadata that propagates with the trace' }
          ],
          tools_title: 'Tools',
          tools_items: [
            { title: 'Jaeger', desc: 'Open-source distributed tracing system' },
            { title: 'Zipkin', desc: 'Focused on latency and dependency analysis' },
            { title: 'OpenTelemetry', desc: 'Open standard for instrumentation' }
          ],
          best_practices_title: 'Best Practices',
          logging_title: 'Logging',
          logging_items: [{ title: 'Appropriate Levels', desc: 'Use appropriate log levels (ERROR, WARN, INFO, DEBUG)' }, { title: 'Context', desc: 'Include relevant information for debugging' }, { title: 'Sensitivity', desc: 'Avoid sensitive data in logs' }],
          tracing_bp_title: 'Tracing',
          tracing_bp_items: [{ title: 'Sampling', desc: 'Configure appropriate sampling rates' }, { title: 'Instrumentation', desc: 'Use standard instrumentation libraries' }, { title: 'Correlation', desc: 'Keep correlation between logs and traces' }]
        },
        logs_page: {
          title: 'Logs and Tracing in Distributed Systems',
          intro_p1: 'In distributed systems, logs and tracing are fundamental for monitoring, debugging, and performance analysis. This section explores best practices and tools to implement a robust observability system.',
          buttons: { logs_simulator: 'Logs Simulator', tracing_simulator: 'Tracing Simulator' },
          levels_title: 'Log Levels',
          levels: { debug_desc: 'Detailed information for debugging', info_desc: 'Normal system events', warn_desc: 'Warnings about unexpected situations', error_desc: 'Errors that need attention' },
          formats: {
            text_title: 'Plain Text Logs',
            text_adv_title: 'Advantages',
            text_adv_items: ['Easy for humans to read', 'Lower processing overhead', 'Compatible with legacy tools', 'Smaller file size'],
            text_disadv_title: 'Disadvantages',
            text_disadv_items: ['Hard to parse programmatically', 'Lack of clear structure', 'Hard to add metadata', 'Prone to formatting errors'],
            json_title: 'JSON Logs',
            json_adv_title: 'Advantages',
            json_adv_items: ['Clear and consistent structure', 'Easy to parse and process', 'Supports rich metadata', 'Better for automated analysis'],
            json_disadv_title: 'Disadvantages',
            json_disadv_items: ['Higher processing overhead', 'Larger log files', 'Less human-readable', 'Can be excessive for simple logs']
          },
          tracing_section: {
            title: 'Distributed Tracing',
            what_is_title: 'What is Tracing?',
            what_is_p: 'Tracing tracks the path of a request across multiple services in a distributed system. Each request receives a unique ID (traceId) that is propagated across services.',
            components_title: 'Main Components',
            components_items: ['TraceId: unique request identifier', 'SpanId: identifier for each operation', 'ParentSpanId: parent-child relationship', 'Tags: additional metadata', 'Timestamps: operation durations'],
            benefits_title: 'Benefits',
            benefits_items: ['Visualization of request flows', 'Bottleneck identification', 'Debugging distributed systems', 'Performance analysis', 'Event correlation']
          },
          best_practices: {
            title: 'Best Practices',
            logging_title: 'Logging',
            logging_items: ['Use appropriate log levels', 'Include relevant context', 'Keep a consistent format', 'Avoid sensitive logs', 'Use correlation IDs', 'Include timestamps', 'Structure metadata', 'Implement log rotation'],
            tracing_title: 'Tracing',
            tracing_items: ['Propagate traceId across services', 'Use spans for key operations', 'Add relevant tags', 'Keep spans concise', 'Implement sampling', 'Configure proper retention', 'Integrate with analysis tools', 'Monitor tracing overhead']
          },
          tools: {
            title: 'Popular Tools',
            logging_title: 'Logging',
            logging_items: ['ELK Stack (Elasticsearch, Logstash, Kibana)', 'Graylog', 'Loki', 'Datadog', 'New Relic', 'Splunk'],
            tracing_title: 'Tracing',
            tracing_items: ['Jaeger', 'Zipkin', 'OpenTelemetry', 'Datadog APM', 'New Relic APM', 'Lightstep']
          }
        },
        logs_simulator: {
          title: 'Logs Simulator',
          intro: 'Explore how to configure and analyze logs in distributed systems. This simulator demonstrates good and bad logging practices.',
          actions: {
            settings: 'Settings',
            reset: 'Reset'
          },
          settings_title: 'Settings',
          settings: {
            auto_advance: 'Auto Advance',
            delay_label: 'Event Delay ({{ms}}ms)'
          },
          controls: {
            info_title: 'INFO',
            add_good_info: 'Add Good INFO',
            add_bad_info: 'Add Bad INFO',
            warn_title: 'WARN',
            add_good_warn: 'Add Good WARN',
            add_bad_warn: 'Add Bad WARN',
            error_title: 'ERROR',
            add_good_error: 'Add Good ERROR',
            add_bad_error: 'Add Bad ERROR'
          },
          viewer_title: 'Log Viewer',
          badges: {
            good: 'Good',
            bad: 'Bad'
          },
          best_practices_title: 'Best Practices',
          best_practices_items: [
            'Use structured logs (JSON format)',
            'Include correlation IDs (traceId, spanId)',
            'Add contextual information',
            'Use appropriate log levels',
            'Include timestamps',
            'Identify service/component',
            'Include relevant metadata',
            'Maintain consistent format'
          ],
          bad_practices_title: 'Bad Practices',
          bad_practices_items: [
            'Log sensitive information',
            'Use inconsistent formats',
            'Log without context',
            'Use inappropriate log levels',
            'Log excessive information',
            'Use unstructured text',
            'Log without timestamps',
            'Mix different patterns'
          ]
        },
        tracing_simulator: {
          title: 'Tracing Simulator',
          intro: 'Explore distributed tracing concepts and understand how requests flow through multiple services.',
          controls_title: 'Controls',
          controls: {
            clear: 'Clear',
            start_request: 'Start Request',
            add_span: 'Add Span',
            finish_request: 'Finish Request'
          },
          current_request_title: 'Current Request',
          trace_id_label: 'TraceId',
          steps_label: 'Step {{current}} of {{total}}',
          timeline_label: 'Timeline',
          history_title: 'Trace History',
          error_badge: 'Error'
        },
        alerts: {
          title: 'Alerts and Notifications in Distributed Systems',
          intro_p1: 'An effective alert and notification system is crucial to maintain the health and availability of distributed systems. It enables identifying and responding quickly to problems before they significantly affect users.',
          key_concept_label: 'Key Concept',
          key_concept_text: 'Alerts should be actionable, relevant and avoid alert fatigue. A good alert system differentiates between critical situations requiring immediate action and conditions that can be handled during normal business hours.',
          types_title: 'Alert Types',
          types: {
            critical: {
              title: 'Critical',
              items: ['Service unavailability', 'Security failures', 'Data loss', 'SLA violations']
            },
            warning: {
              title: 'Warnings',
              items: ['High resource utilization', 'Performance degradation', 'Anomalous trends', 'Non-critical errors']
            },
            info: {
              title: 'Informational',
              items: ['Deployments performed', 'Scheduled maintenance', 'Configuration changes', 'Routine events']
            }
          },
          config_title: 'Alert Configuration',
          thresholds_title: 'Thresholds',
          static_title: 'Static',
          static_items: ['CPU > 80%', 'Memory > 90%', 'Latency > 500ms', 'Error rate > 1%'],
          dynamic_title: 'Dynamic',
          dynamic_items: ['Based on history', 'Machine learning', 'Trend analysis', 'Seasonality'],
          example_title: 'Configuration Example',
          channels_title: 'Notification Channels',
          sync_title: 'Synchronous',
          sync_channels: {
            sms: { title: 'SMS', desc: 'For critical alerts requiring immediate action' },
            calls: { title: 'Calls', desc: 'For critical incident escalation' },
            pagerduty: { title: 'PagerDuty', desc: 'On-call management and escalation' }
          },
          async_title: 'Asynchronous',
          async_channels: {
            email: { title: 'Email', desc: 'For non-urgent notifications and reports' },
            slack: { title: 'Slack', desc: 'For team communication and discussions' },
            dashboards: { title: 'Dashboards', desc: 'For alert visualization and history' }
          },
          incident_title: 'Incident Management',
          process_title: 'Process',
          process_steps: {
            detection: { title: 'Detection', desc: 'Problem identification through alerts' },
            response: { title: 'Response', desc: 'Triggering the responsible team' },
            mitigation: { title: 'Mitigation', desc: 'Actions to resolve the problem' },
            resolution: { title: 'Resolution', desc: 'Definitive fix and documentation' }
          },
          tools_title: 'Tools',
          tools: {
            pagerduty: { title: 'PagerDuty', desc: 'On-call management and incident escalation' },
            opsgenie: { title: 'OpsGenie', desc: 'Alerts and incident response coordination' },
            servicenow: { title: 'ServiceNow', desc: 'ITSM and incident lifecycle management' }
          },
          best_practices_title: 'Best Practices',
          alert_config_title: 'Alert Configuration',
          alert_practices: {
            actionable: { title: 'Actionable Alerts', desc: 'Configure only alerts that require action' },
            noise_reduction: { title: 'Noise Reduction', desc: 'Avoid duplicate or unnecessary alerts' },
            context: { title: 'Context', desc: 'Provide sufficient information for diagnosis' }
          },
          incident_response_title: 'Incident Response',
          response_practices: {
            playbooks: { title: 'Playbooks', desc: 'Maintain documented procedures' },
            escalation: { title: 'Escalation', desc: 'Define clear escalation levels' },
            postmortem: { title: 'Postmortem', desc: 'Perform analysis after incidents' }
          }
        },
        performance: {
          title: 'Performance Analysis in Distributed Systems',
          intro_p1: 'Performance analysis is fundamental to ensure distributed systems meet their performance and scalability requirements. A systematic approach to measurement, analysis and optimization is essential.',
          key_concept_label: 'Key Concept',
          key_concept_text: 'Performance in distributed systems is multidimensional, involving latency, throughput, resource utilization and scalability. Optimizing one aspect often impacts others.',
          metrics_title: 'Performance Metrics',
          core_metrics_title: 'Core Metrics',
          core_metrics: {
            latency: { title: 'Latency', desc: 'Response time for requests' },
            throughput: { title: 'Throughput', desc: 'Requests processed per second' },
            utilization: { title: 'Utilization', desc: 'System resource usage' }
          },
          advanced_metrics_title: 'Advanced Metrics',
          advanced_metrics: {
            apdex: { title: 'Apdex', desc: 'User satisfaction index' },
            percentiles: { title: 'Percentiles', desc: 'P95, P99 latency' },
            saturation: { title: 'Saturation', desc: 'System overload point' }
          },
          testing_title: 'Performance Testing',
          testing_types: {
            load: {
              title: 'Load Testing',
              items: ['Behavior under normal load', 'Average response times', 'Resource usage', 'Sustained throughput']
            },
            stress: {
              title: 'Stress Testing',
              items: ['System limits', 'Behavior under overload', 'Failure points', 'Recovery after failure']
            },
            scalability: {
              title: 'Scalability Testing',
              items: ['Growth capacity', 'Elasticity', 'Scale costs', 'Resource limits']
            }
          },
          tools_title: 'Performance Tools',
          monitoring_title: 'Monitoring',
          apm_tools_title: 'APM Tools',
          apm_tools: ['New Relic', 'Datadog', 'Dynatrace', 'AppDynamics'],
          profiling_title: 'Profiling',
          profiling_tools: ['JProfiler', 'YourKit', 'pprof', 'async-profiler'],
          load_testing_title: 'Load Testing',
          open_source_title: 'Open Source Tools',
          open_source_tools: ['Apache JMeter', 'Gatling', 'k6', 'Locust'],
          cloud_services_title: 'Cloud Services',
          cloud_services: ['BlazeMeter', 'Flood.io', 'LoadRunner Cloud', 'AWS Load Testing'],
          optimization_title: 'Performance Optimization',
          strategies_title: 'Strategies',
          strategies: {
            caching: { title: 'Caching', desc: 'Implementation of different cache levels' },
            load_balancing: { title: 'Load Balancing', desc: 'Efficient load distribution' },
            code_optimization: { title: 'Code Optimization', desc: 'Improvement of algorithms and data structures' }
          },
          techniques_title: 'Techniques',
          techniques: {
            lazy_loading: { title: 'Lazy Loading', desc: 'On-demand resource loading' },
            connection_pooling: { title: 'Connection Pooling', desc: 'Connection reuse' },
            async_processing: { title: 'Asynchronous Processing', desc: 'Non-blocking processing' }
          },
          best_practices_title: 'Best Practices',
          development_title: 'Development',
          development_practices: {
            continuous_profiling: { title: 'Continuous Profiling', desc: 'Monitor performance during development' },
            load_tests: { title: 'Load Tests', desc: 'Include performance tests in CI/CD' },
            benchmarking: { title: 'Benchmarking', desc: 'Compare performance between versions' }
          },
          production_title: 'Production',
          production_practices: {
            realtime_monitoring: { title: 'Real-Time Monitoring', desc: 'Track metrics in real time' },
            capacity_planning: { title: 'Capacity Planning', desc: 'Plan resources in advance' },
            continuous_optimization: { title: 'Continuous Optimization', desc: 'Improve based on real data' }
          }
        },
        health_checks: {
          title: 'Health Checks in Distributed Systems',
          intro_p1: 'Health checks are fundamental for monitoring the health and availability of services in distributed systems. They enable proactive problem detection, facilitate load balancing and assist in recovery strategies.',
          key_concept_label: 'Key Concept',
          key_concept_text: 'A good health check system should be comprehensive, verifying not only if the service is responding, but also its ability to perform its essential functions and access necessary resources.',
          types_title: 'Types of Health Checks',
          types: {
            liveness: {
              title: 'Liveness',
              items: ['Checks if service is alive', 'Detects deadlocks', 'Monitors processes', 'Restarts on failure']
            },
            readiness: {
              title: 'Readiness',
              items: ['Checks availability', 'Connections to dependencies', 'Resource status', 'Traffic control']
            },
            startup: {
              title: 'Startup',
              items: ['Service initialization', 'Resource loading', 'Initial configuration', 'Warm-up period']
            }
          },
          patterns_title: 'Implementation Patterns',
          http_endpoints_title: 'HTTP Endpoints',
          verifications_title: 'Verifications',
          verifications: {
            connections: { title: 'Connections', desc: 'Database, cache, messaging' },
            resources: { title: 'Resources', desc: 'CPU, memory, disk, network' },
            features: { title: 'Features', desc: 'Critical business operations' }
          },
          infrastructure_title: 'Infrastructure Integration',
          orchestration_title: 'Container Orchestration',
          load_balancers_title: 'Load Balancers',
          load_balancer_features: {
            routing: { title: 'Routing', desc: 'Directs traffic to healthy instances' },
            circuit_breaking: { title: 'Circuit Breaking', desc: 'Isolates failed services' },
            auto_scaling: { title: 'Auto Scaling', desc: 'Adjusts capacity based on health' }
          },
          best_practices_title: 'Best Practices',
          implementation_title: 'Implementation',
          implementation_practices: {
            lightweight: { title: 'Lightweight', desc: 'Checks should be light and fast' },
            isolation: { title: 'Isolation', desc: 'Separate checks by responsibility' },
            cache: { title: 'Cache', desc: 'Avoid overhead from frequent checks' }
          },
          monitoring_title: 'Monitoring',
          monitoring_practices: {
            logging: { title: 'Logging', desc: 'Record results and trends' },
            metrics: { title: 'Metrics', desc: 'Collect health metrics' },
            alerts: { title: 'Alerts', desc: 'Configure alerts for failures' }
          }
        }
      },






       security: {
         title: 'Security in Distributed Systems',
         subtitle: 'Explore the main concepts and practices of security in distributed systems',
         info_banner: 'Security is a critical aspect in distributed systems. Understand the main challenges and solutions to protect your systems.',
         topics: {
           authentication: {
             title: 'Authentication',
             description: 'Learn how to verify the identity of users and systems securely and scalably.',
             tag1: 'Identity',
             tag2: 'Security'
           },
           authorization: {
             title: 'Authorization',
             description: 'Discover how to implement granular access control and manage permissions.',
             tag1: 'Permissions',
             tag2: 'Control'
           },
           cryptography: {
             title: 'Cryptography',
             description: 'Understand how to protect data in transit and at rest using cryptography.',
             tag1: 'Protection',
             tag2: 'Privacy'
           },
           tokens: {
             title: 'Tokens and JWT',
             description: 'Learn about session management and access tokens in distributed systems.',
             tag1: 'Sessions',
             tag2: 'Stateless'
           },
           ssl_tls: {
             title: 'SSL/TLS',
             description: 'Explore how to establish secure communication between systems using SSL/TLS.',
             tag1: 'HTTPS',
             tag2: 'Certificates'
           },
           attacks: {
             title: 'Common Attacks',
             description: 'Know the most common attacks and learn how to protect your systems.',
             tag1: 'Prevention',
             tag2: 'Mitigation'
           }
         }
       },

       authentication: {
         title: 'Authentication in Distributed Systems',
         subtitle: 'Understand the concepts, challenges and solutions for authentication in modern distributed systems',
         info_banner: 'Authentication is one of the fundamental pillars of security in distributed systems. In an environment where multiple services need to communicate and verify user identity, implementing a robust authentication strategy is crucial.',
         basic_concepts_title: 'Basic Concepts',
         basic_concepts_description: 'Authentication is the process of verifying if someone or something is who or what they claim to be. In distributed systems, this process involves several components and unique challenges.',
         identification_title: 'Identification',
         identification_description: 'The process of a user declaring their identity to the system, usually through a unique identifier like username or email.',
         verification_title: 'Verification',
         verification_description: 'The process of validating the declared identity, usually through credentials like password, token or digital certificate.',
         authentication_methods_title: 'Authentication Methods',
         password_auth_title: 'Password-Based Authentication',
         password_auth_description: 'The most common authentication method, where the user provides a combination of identifier and password.',
         password_auth_items: [
           'Secure storage with hashing and salt',
           'Password complexity policies',
           'Protection against brute force attacks',
           'Password recovery and reset'
         ],
         token_auth_title: 'Token-Based Authentication',
         token_auth_description: 'Stateless method that uses tokens to maintain authentication state.',
         token_auth_items: [
           'JSON Web Tokens (JWT)',
           'Access and refresh tokens',
           'Session management',
           'Token revocation'
         ],
         token_auth_link: 'Learn more about Tokens and JWT',
         oauth_title: 'OAuth 2.0 and OpenID Connect',
         oauth_description: 'Standard protocols for authorization and authentication in distributed systems.',
         oauth_items: [
           'Authorization flows',
           'Single Sign-On (SSO)',
           'Access delegation',
           'Identity Providers'
         ],
         mfa_title: 'Multi-Factor Authentication (MFA)',
         mfa_description: 'Adds extra layers of security beyond password.',
         mfa_items: [
           'Verification codes via SMS or email',
           'Authenticator apps (TOTP)',
           'Physical security keys (FIDO2/WebAuthn)',
           'Biometrics'
         ],
         challenges_best_practices_title: 'Challenges and Best Practices',
         challenges_title: 'Challenges',
         challenges_items: [
           'Authentication system scalability',
           'Distributed session management',
           'Protection against common attacks',
           'Latency in distributed verifications',
           'Consistency across multiple services'
         ],
         best_practices_title: 'Best Practices',
         best_practices_items: [
           'Use HTTPS for all communications',
           'Implement rate limiting',
           'Logging and monitoring of attempts',
           'Regular rotation of keys and tokens',
           'Input validation and sanitization'
         ],
         implementation_title: 'Implementation',
         implementation_description: 'Implementing an authentication system in a distributed environment requires careful planning and consideration of several aspects:',
         architecture_title: 'Architecture',
         architecture_items: [
           'Centralized authentication service',
           'API Gateway for validation',
           'Distributed cache',
           'User database'
         ],
         security_title: 'Security',
         security_items: [
           'Encryption in transit',
           'CSRF protection',
           'Security headers',
           'Access auditing'
         ],
         experience_title: 'Experience',
         experience_items: [
           'Authentication UX',
           'Error feedback',
           'Access recovery',
           'Profile and preferences'
         ]
       },

       authorization: {
         title: 'Authorization in Distributed Systems',
         subtitle: 'Access control, permissions and security policies in distributed environments',
         info_banner: 'Authorization is the process that determines what an authenticated user can do in the system. In distributed systems, implementing an effective authorization strategy is essential to ensure security and granular access control to resources.',
         fundamental_concepts_title: 'Fundamental Concepts',
         authorization_concept_title: 'Authorization',
         authorization_concept_description: 'Process of verifying if a user has permission to access a resource or perform a specific action in the system.',
         permissions_concept_title: 'Permissions',
         permissions_concept_description: 'Specific rights granted to users or groups to perform operations on system resources.',
         policies_concept_title: 'Policies',
         policies_concept_description: 'Rules and conditions that define how authorization decisions are made in the system.',
         access_control_models_title: 'Access Control Models',
         rbac_title: 'Role-Based Access Control (RBAC)',
         rbac_description: 'Role-based access control, where permissions are associated with roles and users are assigned to these roles.',
         rbac_components_title: 'RBAC Components',
         rbac_components: [
           'Users: Entities that need to access resources',
           'Roles: Sets of grouped permissions',
           'Permissions: Rights to access resources',
           'Sessions: Role activation for users'
         ],
         abac_title: 'Attribute-Based Access Control (ABAC)',
         abac_description: 'Model that uses attributes of users, resources and environment to make dynamic authorization decisions.',
         abac_attributes_title: 'Considered Attributes',
         abac_attributes: [
           'User attributes (position, department, level)',
           'Resource attributes (type, sensitivity, owner)',
           'Environment attributes (time, location, device)',
           'Action attributes (read, write, delete)'
         ],
         pbac_title: 'Policy-Based Access Control (PBAC)',
         pbac_description: 'Access control based on policies that combine different aspects of RBAC and ABAC with complex business rules.',
         pbac_characteristics_title: 'Characteristics',
         pbac_characteristics: [
           'Centralized and reusable policies',
           'Condition-based rules',
           'Support for complex hierarchies',
           'Auditing and compliance'
         ],
         distributed_implementation_title: 'Implementation in Distributed Systems',
         architecture_title: 'Architecture',
         architecture_items: [
           'Centralized authorization service',
           'Distributed policy cache',
           'Update propagation',
           'Multi-layer validation'
         ],
         challenges_title: 'Challenges',
         challenges_items: [
           'Latency in authorization decisions',
           'Consistency between services',
           'System scalability',
           'Policy maintenance'
         ],
         best_practices_title: 'Best Practices',
         design_title: 'Design',
         design_items: [
           'Principle of least privilege',
           'Separation of responsibilities',
           'Adequate granularity',
           'Complete auditing'
         ],
         implementation_title: 'Implementation',
         implementation_items: [
           'Intelligent cache',
           'Layered decisions',
           'Continuous monitoring',
           'Atomic updates'
         ],
         tools_technologies_title: 'Tools and Technologies',
         frameworks_title: 'Frameworks',
         frameworks_items: [
           'OAuth 2.0 and OpenID Connect',
           'Keycloak',
           'Spring Security',
           'IdentityServer'
         ],
         protocols_title: 'Protocols',
         protocols_items: [
           'XACML',
           'SAML',
           'UMA 2.0',
           'SCIM'
         ],
         services_title: 'Services',
         services_items: [
           'AWS IAM',
           'Azure AD',
           'Google Cloud IAM',
           'Auth0'
         ]
       },

       cryptography: {
         title: 'Cryptography in Distributed Systems',
         subtitle: 'Data protection, secure communication and key management in distributed environments',
         simulator_button: 'Try the Cryptography Simulator',
         info_banner: 'Cryptography is fundamental to ensure security in distributed systems, protecting data at rest and in transit. Understanding its concepts and implementations is essential to build secure and reliable systems.',
         fundamentals_title: 'Cryptography Fundamentals',
         confidentiality_title: 'Confidentiality',
         confidentiality_description: 'Ensures that only authorized parties can access and understand the protected information.',
         integrity_title: 'Integrity',
         integrity_description: 'Ensures that data has not been altered during storage or transmission.',
         authenticity_title: 'Authenticity',
         authenticity_description: 'Confirms the origin of data and ensures that the parties involved are who they claim to be.',
         types_title: 'Types of Cryptography',
         symmetric_title: 'Symmetric Cryptography',
         symmetric_description: 'Uses the same key to encrypt and decrypt data. It is fast and efficient for large volumes of data.',
         symmetric_algorithms_title: 'Common Algorithms',
         symmetric_algorithms: [
           'AES (Advanced Encryption Standard)',
           'ChaCha20',
           '3DES (Triple DES)',
           'Blowfish'
         ],
         asymmetric_title: 'Asymmetric Cryptography',
         asymmetric_description: 'Uses a pair of keys (public and private) for encryption and decryption operations.',
         asymmetric_algorithms_title: 'Algorithms and Uses',
         asymmetric_algorithms: [
           'RSA: Encryption and digital signature',
           'ECC: Elliptic curves for resource-limited devices',
           'Diffie-Hellman: Key exchange',
           'Ed25519: Modern digital signatures'
         ],
         hash_title: 'Cryptographic Hash Functions',
         hash_description: 'Generate a unique fingerprint of data, ensuring integrity and non-repudiation.',
         hash_algorithms_title: 'Popular Algorithms',
         hash_algorithms: [
           'SHA-256/SHA-3: Current standard for secure hashing',
           'BLAKE2/BLAKE3: High performance',
           'Argon2: Specific for passwords',
           'HMAC: Keyed hash for authentication'
         ],
         key_management_title: 'Key Management',
         lifecycle_title: 'Lifecycle',
         lifecycle_items: [
           'Secure key generation',
           'Distribution and exchange',
           'Protected storage',
           'Rotation and revocation'
         ],
         best_practices_title: 'Best Practices',
         best_practices_items: [
           'Hardware Security Modules (HSM)',
           'Key Derivation Functions',
           'Backup and recovery',
           'Usage auditing'
         ],
         security_protocols_title: 'Security Protocols',
         tls_ssl_title: 'TLS/SSL',
         tls_ssl_description: 'Standard protocol for secure communication on the web and between services.',
         tls_ssl_items: [
           'Handshake and cipher negotiation',
           'Digital certificates',
           'Perfect Forward Secrecy',
           'HTTPS and HSTS'
         ],
         other_protocols_title: 'Other Protocols',
         other_protocols_items: [
           'SSH: Secure remote access',
           'IPsec: Network layer security',
           'WireGuard: Modern VPN',
           'Signal Protocol: Secure messaging'
         ],
         secure_implementation_title: 'Secure Implementation',
         implementation_intro: 'When implementing cryptography in distributed systems, consider:',
         dont_title: 'Don\'t Do',
         dont_items: [
           'Implement your own algorithms',
           'Reuse keys or IVs',
           'Store keys in code',
           'Ignore validations'
         ],
         do_title: 'Do',
         do_items: [
           'Use proven libraries',
           'Implement Perfect Forward Secrecy',
           'Validate certificates',
           'Monitor and update'
         ],
         consider_title: 'Consider',
         consider_items: [
           'Performance requirements',
           'Legal compliance',
           'Disaster recovery',
           'Auditing and logging'
         ]
       },

       cryptography_simulator: {
         title: 'Cryptography Simulator',
         subtitle: 'Experience different types of cryptography, hashing and encoding in practice',
         text_input_label: 'Text to Process',
         text_input_placeholder: 'Type the text here...',
         key_label: 'Key (required only for AES)',
         key_placeholder: 'Secret key...',
         operation_label: 'Operation',
         operations: {
           aes: 'AES Encryption',
           sha256: 'SHA-256 Hash',
           md5: 'MD5 Hash (Not recommended)',
           base64: 'Base64 Encoding'
         },
         process_button: 'Process',
         clear_button: 'Clear Results',
         results_title: 'Results',
         no_results: 'Results will appear here after processing...',
         result_labels: {
           input: 'Input:',
           output: 'Output:',
           details: 'Details:'
         },
         error_messages: {
           encryption_error: 'Encryption error',
           check_key_data: 'Check the key and data',
           hash_error: 'Hash error',
           check_data: 'Check the data',
           encoding_error: 'Encoding error',
           key_required: 'Error: Key required',
           provide_aes_key: 'Provide a key for AES encryption'
         },
         algorithm_details: {
           aes: 'AES-256-CBC',
           sha256: 'SHA-256',
           md5: 'MD5 (Not recommended for production use)',
           base64: 'Base64'
         },
         instructions_title: 'How to Use',
         instructions: [
           'Enter the text you want to process in the input field',
           'If choosing AES encryption, provide a secret key',
           'Select the desired operation from the dropdown menu',
           'Click "Process" to see the result',
           'The last 5 results will be kept for comparison'
         ],
         important_notes_title: 'Important Notes',
         important_notes: [
           'AES is a secure and widely used symmetric encryption algorithm',
           'SHA-256 is recommended for secure data hashing',
           'MD5 is included only for educational purposes - do not use in production',
           'Base64 is an encoding, not a form of encryption'
         ]
       },

       tokens_and_jwt: {
         title: 'Tokens and JWT in Distributed Systems',
         subtitle: 'Understand how tokens and JSON Web Tokens (JWT) work in distributed systems',
         simulator_button: 'Try the JWT Simulator',
         info_banner: 'Tokens are the foundation of modern authentication in distributed systems, enabling secure and stateless communication between different services and applications.',
         fundamentals_title: 'Token Fundamentals',
         what_are_tokens_title: 'What are Tokens?',
         tokens_description: 'Tokens are digital credentials that represent authorizations and identities in distributed systems. They function as a "digital pass" that allows:',
         token_benefits: [
           'Authentication without the need to store sessions on the server',
           'Secure information sharing between services',
           'Identity validation without constant database queries',
           'Efficient permission and access management'
         ],
         jwt_section_title: 'JSON Web Tokens (JWT)',
         jwt_standard_title: 'The JWT Standard',
         jwt_description: 'JWT is an open standard (RFC 7519) that defines a compact and secure format for transmitting information between parties as a JSON object. Each token is:',
         jwt_features: [
           'Digitally signed to ensure authenticity',
           'Encoded in Base64URL for easy transmission',
           'Self-contained, carrying all necessary information',
           'Verifiable independently of the issuer'
         ],
         jwt_anatomy_title: 'Anatomy of a JWT',
         header_title: 'Header',
         header_description: 'Token metadata, including type and signature algorithm',
         payload_title: 'Payload',
         payload_description: 'Token data (claims) that carry the main information',
         signature_title: 'Signature',
         signature_description: 'Signature that ensures the integrity and authenticity of the token',
         claims_title: 'Claims: The Heart of JWT',
         claims_description: 'Claims are the declarations that make up the JWT payload, carrying information about the entity (usually the user) and token metadata.',
         registered_claims_title: 'Registered Claims',
         registered_claims_description: 'Standardized claims by JWT, with specific purposes:',
         registered_claims: [
           { code: 'iss', name: 'issuer', description: 'Identifies who issued the token' },
           { code: 'sub', name: 'subject', description: 'Identifies the subject of the token' },
           { code: 'exp', name: 'expiration', description: 'Expiration timestamp' },
           { code: 'iat', name: 'issued at', description: 'Issuance timestamp' }
         ],
         public_claims_title: 'Public Claims',
         public_claims_description: 'Claims defined freely, but registered in the IANA JWT Registry to avoid collisions. Useful for standardized information such as:',
         public_claims_items: [
           'User name and information',
           'Roles and permissions',
           'Organizational information'
         ],
         private_claims_title: 'Private Claims',
         private_claims_description: 'Custom claims for specific use between the involved parties. Ideal for:',
         private_claims_items: [
           'Application-specific metadata',
           'Custom configurations',
           'Internal control information'
         ],
         best_practices_title: 'Implementation Best Practices',
         payload_optimization_title: 'Payload Optimization',
         payload_optimization_description: 'Keep tokens compact for better performance:',
         payload_optimization_items: [
           'Include only essential data',
           'Use short names for claims',
           'Avoid information duplication'
         ],
         transmission_security_title: 'Transmission Security',
         transmission_security_description: 'Protect token transmission:',
         transmission_security_items: [
           'Always use HTTPS for transmission',
           'Implement rate limiting',
           'Monitor suspicious access attempts'
         ],
         lifecycle_management_title: 'Lifecycle Management',
         lifecycle_management_description: 'Properly manage token lifespan:',
         lifecycle_management_items: [
           'Define appropriate expiration times',
           'Implement automatic renewal',
           'Maintain a list of revoked tokens'
         ],
         data_protection_title: 'Data Protection',
         data_protection_description: 'Protect sensitive information:',
         data_protection_items: [
           'Never include credentials in the payload',
           'Avoid sensitive personal data',
           'Use private claims for internal data'
         ],
         auth_flow_title: 'JWT Authentication Flow',
         initial_auth_title: 'Initial Authentication',
         initial_auth_description: 'The user provides their credentials (email/password) through a secure login form. The server validates these credentials against the database.',
         jwt_generation_title: 'JWT Generation',
         jwt_generation_description: 'After successful validation, the server generates a JWT containing relevant user information, such as ID, roles, and permissions. The token is signed with a secret key.',
         secure_storage_title: 'Secure Storage',
         secure_storage_description: 'The client receives and stores the token securely, either in an HTTP-only cookie for web applications or in secure storage for mobile apps.',
         authenticated_requests_title: 'Authenticated Requests',
         authenticated_requests_description: 'In each subsequent request, the client includes the JWT in the Authorization header using the Bearer scheme: Authorization: Bearer <token>',
         validation_authorization_title: 'Validation and Authorization',
         validation_authorization_description: 'The server validates the token signature, checks expiration, and uses the claims to authorize access to the requested resources.',
         security_considerations_title: 'Security Considerations',
         risks_mitigations_title: 'Risks and Mitigations',
         xss_attacks_title: 'XSS Attacks',
         xss_attacks_description: 'Protect against Cross-Site Scripting:',
         xss_protection_items: [
           'Use HTTP-only cookies for tokens',
           'Implement CSP (Content Security Policy)',
           'Sanitize all user inputs'
         ],
         csrf_title: 'CSRF',
         csrf_description: 'Prevent Cross-Site Request Forgery:',
         csrf_protection_items: [
           'Use CSRF tokens for important operations',
           'Check Origin/Referer header',
           'Implement SameSite cookies'
         ],
         token_theft_title: 'Token Theft',
         token_theft_description: 'Minimize the impact of compromised tokens:',
         token_theft_protection_items: [
           'Implement refresh tokens with rotation',
           'Keep short expiration for access tokens',
           'Monitor suspicious usage patterns',
           'Maintain a blacklist of revoked tokens'
         ]
       },

       jwt_simulator: {
         title: 'JWT Simulator',
         subtitle: 'Experience JWT token generation and validation in practice',
         token_configuration_title: 'Token Configuration',
         user_information_title: 'User Information',
         name_label: 'Name',
         email_label: 'Email',
         role_label: 'Role',
         roles: {
           user: 'User',
           admin: 'Administrator',
           guest: 'Guest'
         },
         token_settings_title: 'Token Settings',
         algorithm_label: 'Signature Algorithm',
         expiration_label: 'Expiration Time (seconds)',
         custom_claims_title: 'Custom Claims',
         key_placeholder: 'Key',
         value_placeholder: 'Value',
         add_claim_button: 'Add Claim',
         generated_token_title: 'Generated Token',
         verify_token_button: 'Verify Token',
         no_token_message: 'Configure and generate a token to view it here',
         decoded_token_title: 'Decoded Token',
         header_title: 'Header',
         payload_title: 'Payload',
         signature_title: 'Signature',
         verification_result_title: 'Verification Result',
         verification_messages: {
           no_token: 'No token to verify',
           expired: 'Token expired',
           valid: 'Token valid'
         },
         how_to_use_title: 'How to Use',
         instructions: [
           'Configure user information and token settings in the left panel',
           'Add custom claims if desired (optional)',
           'Click "Generate Token" to create a new JWT',
           'View the generated token and its decoded version in the right panel',
           'Use the "Verify Token" button to simulate token validation'
         ]
       },

       attack_simulator: {
         back_to_attacks: 'Back to Attacks',
         title: 'Attack Simulator',
         subtitle: 'Explore interactively how different types of attacks work in distributed systems. This simulator visually demonstrates the behavior and impact of DDoS and Man-in-the-Middle attacks.',
         how_to_use_title: 'How to Use the Simulator',
         how_to_use_steps: [
           'Select the type of attack you want to simulate (DDoS or Man-in-the-Middle)',
           'Adjust the simulation speed as needed',
           'Click "Start Simulation" to begin the visualization',
           'Observe the packet behavior and impact on the server'
         ],
         simulator_elements_title: 'Simulator Elements',
         simulator_elements: [
           'Legitimate clients trying to access the service',
           'Server processing the requests',
           'Attackers generating malicious traffic',
           'Legitimate packets (green) and malicious packets (red)'
         ],
         ddos_attack_button: 'DDoS Attack',
         mitm_attack_button: 'Man-in-the-Middle',
         speed_label: 'Speed:',
         start_simulation: 'Start Simulation',
         stop_simulation: 'Stop Simulation',
         ddos_simulation_title: 'DDoS Attack Simulation',
         ddos_simulation_description: 'This simulation shows how multiple attackers overwhelm a server with malicious traffic, making it difficult for legitimate users to access the service. The server becomes overloaded when receiving many requests.',
         mitm_simulation_title: 'Man-in-the-Middle Attack Simulation',
         mitm_simulation_description: 'This simulation demonstrates how an attacker can intercept communication between client and server by positioning themselves in the middle of the connection. The attacker can read and modify transmitted data.',
         legitimate_traffic: 'Legitimate Traffic',
         malicious_traffic: 'Malicious Traffic'
       },

       ssl_tls: {
         title: 'SSL/TLS in Distributed Systems',
         subtitle: 'Security protocols for secure communication in networks and distributed systems',
         info_banner: 'SSL/TLS are fundamental protocols that ensure the security of communications on the internet, protecting sensitive data and ensuring the authenticity of services.',
         overview_title: 'Overview',
         what_is_ssl_tls_title: 'What is SSL/TLS?',
         what_is_ssl_tls_description: 'SSL (Secure Sockets Layer) and its successor TLS (Transport Layer Security) are cryptographic protocols that provide secure communication over the internet. They operate at the transport layer, ensuring:',
         ssl_tls_features: [
           'Data confidentiality',
           'Message integrity',
           'Server authentication',
           'Optional client authentication'
         ],
         evolution_title: 'Evolution',
         evolution_versions: [
           { version: 'SSL 2.0/3.0', status: 'Obsolete and insecure', color: 'red' },
           { version: 'TLS 1.0/1.1', status: 'Discontinued', color: 'yellow' },
           { version: 'TLS 1.2', status: 'Widely supported', color: 'green' },
           { version: 'TLS 1.3', status: 'Latest and most secure version', color: 'blue' }
         ],
         how_it_works_title: 'How It Works',
         tls_handshake_title: 'The TLS Handshake',
         handshake_steps: [
           {
             title: 'Client Hello',
             description: 'The client initiates the connection by sending:',
             items: [
               'Supported TLS version',
               'List of cipher suites',
               'Random number',
               'Supported extensions'
             ]
           },
           {
             title: 'Server Hello',
             description: 'The server responds with:',
             items: [
               'Digital certificate',
               'Chosen cipher suite',
               'Server random number',
               'Negotiated extensions'
             ]
           },
           {
             title: 'Key Exchange',
             description: 'Key exchange and secret establishment:',
             items: [
               'Client verifies the certificate',
               'Pre-master secret generation',
               'Session key derivation'
             ]
           },
           {
             title: 'Finished',
             description: 'Handshake completion:',
             items: [
               'Integrity verification',
               'Parameter confirmation',
               'Start of secure communication'
             ]
           }
         ],
         digital_certificates_title: 'Digital Certificates',
         certificate_structure_title: 'Structure',
         certificate_structure_items: [
           'Certificate holder information',
           'Public key',
           'Validity period',
           'Issuer (CA)',
           'CA digital signature',
           'Serial number'
         ],
         certificate_types_title: 'Types',
         certificate_types: [
           { name: 'DV (Domain Validation)', description: 'Basic domain validation' },
           { name: 'OV (Organization Validation)', description: 'Organization validation' },
           { name: 'EV (Extended Validation)', description: 'Extended and rigorous validation' }
         ],
         cipher_suites_title: 'Cipher Suites',
         cipher_suites_description: 'Cipher suites are sets of algorithms that define how communication will be protected. A typical cipher suite includes:',
         cipher_components: [
           {
             title: 'Key Exchange',
             algorithms: ['ECDHE', 'DHE', 'RSA']
           },
           {
             title: 'Authentication',
             algorithms: ['RSA', 'ECDSA', 'PSK']
           },
           {
             title: 'Encryption',
             algorithms: ['AES-GCM', 'ChaCha20', 'AES-CBC']
           },
           {
             title: 'MAC',
             algorithms: ['AEAD', 'SHA-384', 'POLY1305']
           }
         ],
         best_practices_title: 'Best Practices',
         configuration_title: 'Configuration',
         configuration_items: [
           'Use only TLS 1.2 and 1.3',
           'Disable insecure cipher suites',
           'Configure HSTS',
           'Implement OCSP Stapling'
         ],
         certificates_title: 'Certificates',
         certificates_items: [
           'Keep certificates updated',
           'Use strong keys (RSA 2048+ or ECC)',
           'Implement automatic renewal',
           'Protect private keys'
         ],
         monitoring_title: 'Monitoring',
         monitoring_items: [
           'Monitor certificate expiration',
           'Check for known vulnerabilities',
           'Perform regular security tests',
           'Maintain access logs'
         ],
         security_considerations_title: 'Security Considerations',
         common_threats_title: 'Common Threats',
         common_threats_items: [
           'MITM (Man-in-the-Middle)',
           'Downgrade Attacks',
           'Protocol Vulnerabilities',
           'Certificate Spoofing'
         ],
         mitigations_title: 'Mitigations',
         mitigations_items: [
           'Certificate Pinning',
           'Perfect Forward Secrecy',
           'Strong Cipher Preferences',
           'Regular Security Updates'
         ]
       },

       common_attacks: {
         title: 'Attacks on Distributed Systems',
         subtitle: 'Understand the main types of attacks, their impacts and mitigation strategies',
         warning_banner: 'Attacks on distributed systems can cause serious damage to infrastructure, compromise sensitive data and result in significant financial losses. It is crucial to understand and implement adequate protection measures.',
         simulator_title: 'Interactive Attack Simulator',
         simulator_description: 'Experience our interactive tool that visually demonstrates how DDoS and Man-in-the-Middle attacks work. Visualize the impact of attacks in real time and better understand protection strategies.',
         simulator_button: 'Access Simulator',
         categories_title: 'Attack Categories',
         network_attacks_title: 'Network Attacks',
         network_attacks: [
           'DDoS (Distributed Denial of Service)',
           'Man-in-the-Middle (MITM)',
           'DNS Spoofing',
           'ARP Poisoning',
           'TCP/IP Hijacking'
         ],
         application_attacks_title: 'Application Attacks',
         application_attacks: [
           'SQL Injection',
           'Cross-Site Scripting (XSS)',
           'CSRF (Cross-Site Request Forgery)',
           'Command Injection',
           'File Inclusion'
         ],
         authentication_attacks_title: 'Authentication Attacks',
         authentication_attacks: [
           'Brute Force',
           'Dictionary Attacks',
           'Session Hijacking',
           'Credential Stuffing',
           'Password Spraying'
         ],
         ddos_title: 'DDoS Attacks',
         ddos_description: 'Distributed Denial of Service (DDoS) attacks aim to make resources or services unavailable to legitimate users by overwhelming systems with malicious traffic.',
         ddos_types_title: 'Common Types',
         ddos_types: [
           { name: 'Volumetric', description: 'Floods the network with high volume traffic' },
           { name: 'Protocol', description: 'Exploits vulnerabilities in network protocols' },
           { name: 'Application', description: 'Attacks application layer with malicious requests' }
         ],
         ddos_mitigation_title: 'Mitigation',
         ddos_mitigation: [
           'Firewalls and WAFs',
           'Rate Limiting',
           'Load Balancing',
           'Traffic Analysis',
           'CDN Protection',
           'Blackholing'
         ],
         mitm_title: 'Man-in-the-Middle Attacks',
         mitm_how_works_title: 'How It Works',
         mitm_description: 'The attacker positions themselves between two communicating parties, intercepting and potentially modifying communication without the parties noticing.',
         mitm_techniques: [
           'Traffic interception',
           'Data modification',
           'Information theft',
           'Identity falsification'
         ],
         mitm_prevention_title: 'Prevention',
         mitm_prevention: [
           'Use of TLS/SSL',
           'Certificate Pinning',
           'VPNs',
           'Mutual Authentication',
           'HSTS'
         ],
         injection_title: 'Injection Attacks',
         sql_injection_title: 'SQL Injection',
         sql_vulnerability_title: 'Vulnerability',
         sql_vulnerability_description: 'Insertion of malicious SQL code into data inputs to manipulate or extract information from the database.',
         sql_prevention_title: 'Prevention',
         sql_prevention: [
           'Prepared Statements',
           'Input Validation',
           'Escaping',
           'Least Privilege'
         ],
         xss_title: 'Cross-Site Scripting (XSS)',
         xss_vulnerability_title: 'Vulnerability',
         xss_vulnerability_description: 'Injection of malicious scripts into web pages viewed by other users, allowing session theft and content manipulation.',
         xss_prevention_title: 'Prevention',
         xss_prevention: [
           'Input Sanitization',
           'Content Security Policy',
           'HttpOnly Cookies',
           'Output Encoding'
         ],
         auth_attacks_title: 'Authentication Attacks',
         brute_force_title: 'Brute Force',
         brute_force_description: 'Systematic attempts to guess credentials by testing all possible combinations.',
         brute_force_mitigation_title: 'Mitigation',
         brute_force_mitigation: [
           'Rate Limiting',
           'CAPTCHA',
           'Account Lockout',
           'Strong Passwords'
         ],
         session_hijacking_title: 'Session Hijacking',
         session_hijacking_description: 'Theft or forgery of session tokens to access authenticated user accounts.',
         session_hijacking_mitigation_title: 'Mitigation',
         session_hijacking_mitigation: [
           'Secure Session Management',
           'SSL/TLS',
           'Session Timeout',
           'Regenerate IDs'
         ],
         credential_stuffing_title: 'Credential Stuffing',
         credential_stuffing_description: 'Automated use of leaked username/password pairs to attempt access across multiple services.',
         credential_stuffing_mitigation_title: 'Mitigation',
         credential_stuffing_mitigation: [
           'Multi-factor Authentication',
           'Password Policies',
           'Breach Detection',
           'IP-based Rate Limiting'
         ],
         best_practices_title: 'Security Best Practices',
         prevention_title: 'Prevention',
         prevention_practices: [
           'Keep all systems and dependencies updated',
           'Implement strong and multi-factor authentication',
           'Use HTTPS in all communications',
           'Validate and sanitize all user inputs',
           'Implement adequate logging and monitoring'
         ],
         monitoring_title: 'Monitoring',
         monitoring_practices: [
           'Configure alerts for suspicious behavior',
           'Perform regular security audits',
           'Maintain access and activity logs',
           'Implement intrusion detection',
           'Monitor performance and availability metrics'
         ]
       },

    },



    simulators_extra: {
      replication: {
        title: 'Replication Simulator',
        intro: 'Explore how different replication strategies affect data consistency and availability.',
        how_title: 'How to use the simulator:',
        steps: [
          'Choose the replication type: Synchronous, Semi-synchronous, or Asynchronous',
          'Adjust parameters: network latency, failure rate, number of replicas',
          'Observe results: propagation time, per-region status, impact of failures'
        ],
        config_title: 'Settings',
        replication_type: 'Replication Type',
        sync: 'Synchronous', semi_sync: 'Semi-synchronous', async: 'Asynchronous',
        network_latency_ms: 'Network Latency (ms)',
        failure_rate: 'Failure Rate',
        replica_count: 'Number of Replicas',
        manual_title: 'Manual Operation',
        key_placeholder: 'Key', value_placeholder: 'Value', write: 'Write',
        start: 'Start Simulation', stop: 'Stop Simulation',
        statuses: { healthy: 'healthy', failed: 'failed', role: 'Role', latency: 'Latency', data: 'Data', keys_label: '{{count}} keys', replicated_after: 'Replicated after {{seconds}}s' },
        simulate_failure: 'Simulate Failure', recover: 'Recover',
        recent_ops: 'Recent Operations', read_label: 'Read', write_label: 'Write'
      }
    }
  },
  pt: {
    translation: {
      command_center: {
        gui_name: 'DINAMOS GRAPHIC USER INTERFACE',
        open_access: 'ACESSO ABERTO',
        operator_label: 'OPERADOR',
        access_label: 'ACESSO',
        system_label: 'SISTEMA',
        sync_label: 'SINC',
        guest: 'VISITANTE',
        title: 'Centro de Comando',
        session_active: 'SESSÃO ATIVA',
        operator: 'Operador',
        readiness_suffix: '// prontidão da missão {{pct}}%',
        quick_jump: 'Acesso Rápido',
        metrics_title: 'Métricas Globais da Missão',
        modules_cleared: 'Módulos Concluídos',
        lessons_done: 'Lições Concluídas',
        readiness: 'Prontidão',
        clearance: 'Autorização',
        stat_of: 'de {{count}}',
        operation_activity: 'Atividade da Operação',
        recommended_next: 'Próxima Operação Recomendada',
        deploy: 'Iniciar',
        all_cleared: 'TODAS AS OPERAÇÕES CONCLUÍDAS',
        mission_table: 'Tabela de Missões',
        col_operation: 'Operação',
        col_priority: 'Prioridade',
        col_progress: 'Progresso',
        col_status: 'Status',
        activity_feed: 'Feed de Atividades',
        view_all: 'Ver Tudo',
        no_transmissions: 'NENHUMA TRANSMISSÃO RECENTE',
        replies: '{{count}} respostas',
        search_placeholder: 'BUSCAR OPERAÇÕES...',
        search_aria: 'Buscar lições',
        no_matches: 'NENHUM RESULTADO',
        time_now: 'agora',
        action_review: 'Revisar',
        action_resume: 'Continuar',
        action_start: 'Iniciar',
        tier: {
          foundational: 'FUNDAMENTAL',
          core: 'ESSENCIAL',
          advanced: 'AVANÇADO',
          applied: 'APLICADO',
        },
        modules: {
          fundamentals: 'Fundamentos',
          theory: 'Fundamentos Teóricos',
          components: 'Componentes de Sistema',
          design: 'Princípios de Design',
          consistency: 'Estratégias de Consistência',
          security: 'Segurança',
          monitoring: 'Monitoramento e Manutenção',
          'ai-systems': 'Sistemas de IA e LLMs',
          'data-storage': 'Dados e Armazenamento',
          cases: 'Casos do Mundo Real',
        },
      },
      quick_access: {
        title: 'ACESSO RÁPIDO',
        command_center: 'Centro de Comando',
        roadmap: 'Roteiro',
        editor: 'Editor de Sistemas',
        forum: 'Fórum',
        preferences: 'Preferências',
      },
      common: {
        start_now: 'Começar Agora',
        view_content: 'Ver Conteúdo',
        free_editor: 'Editor Gratuito!',
        access_free_editor: 'Experimente o Editor de Sistemas Distribuídos totalmente grátis, sem cadastro!',
        new_offer: 'Nova Oferta Especial',
        final_cta_title: 'Pronto para se tornar um especialista?',
        final_cta_subtitle: 'Junte-se a centenas de desenvolvedores que já estão dominando sistemas distribuídos na prática',
        guarantee_spot: 'Garantir Minha Vaga',
        loading: 'Carregando o roadmap...',
        discount_off: '{{percent}}% OFF',
        month: 'mês',
        year: 'ano'
      },
      footer: {
        all_rights_reserved: 'Todos os direitos reservados.',
        privacy_policy: 'Política de Privacidade',
        terms: 'Termos de Serviço'
      },
      protected_route: {
        loading: 'Carregando...',
        verifying_access: 'Verificando acesso...',
        attempt: 'Tentativa {{attempt}}/{{total}}',
        access_denied: 'Acesso negado',
        redirecting: 'Redirecionando...'
      },
      language_dialog: {
        title: 'Escolha seu Idioma',
        detected_portuguese: 'Detectamos que seu navegador está em português. Gostaria de continuar em português?',
        detected_other: 'Detectamos que seu navegador está em inglês ou outro idioma. Gostaria de continuar em inglês?',
        continue_portuguese: 'Continuar em Português',
        continue_english: 'Continuar em Inglês',
        switch_english: 'Mudar para Inglês',
        switch_portuguese: 'Mudar para Português'
      },
      badges: {
        free: 'Grátis',
        new: 'Novo'
      },
      cookies: {
        banner: {
          title: 'Usamos cookies',
          description: 'Usamos cookies para melhorar sua experiência, analisar o tráfego do site e fornecer conteúdo personalizado. Você pode escolher quais cookies aceitar.',
          accept: 'Aceitar Todos',
          reject: 'Rejeitar Todos',
          customize: 'Personalizar'
        },
        preferences: {
          title: 'Preferências de Cookies',
          save: 'Salvar Preferências',
          accept: 'Aceitar Todos',
          reject: 'Rejeitar Todos'
        },
        necessary: {
          title: 'Cookies Necessários',
          description: 'Essenciais para funcionalidade básica do site, autenticação e segurança. Não podem ser desabilitados.'
        },
        analytics: {
          title: 'Cookies de Análise',
          description: 'Nos ajudam a entender como os visitantes interagem com nosso site coletando e relatando informações anonimamente.'
        },
        functional: {
          title: 'Cookies Funcionais',
          description: 'Habilitam funcionalidades aprimoradas como lembrar suas preferências e fornecer recursos personalizados.'
        },
        marketing: {
          title: 'Cookies de Marketing',
          description: 'Rastreiam visitantes através de sites para exibir anúncios relevantes e envolventes.'
        },
        policy: {
          text: 'Para mais informações, leia nossa',
          privacy: 'Política de Privacidade',
          cookies: 'Política de Cookies'
        }
      },
      status: {
        recommended: 'Recomendado',
        new: 'Novo',
        content: 'Conteúdo',
        coming_soon: 'Em breve'
      },
      content: {
        mark_complete: 'Marcar como concluído',
        completed_label: 'Concluído',
        reading_time: '{{minutes}} min de leitura',
      },
      auth: {
        welcome_title: 'Bem-vindo ao System Design',
        welcome_subtitle: 'Faça login para acessar o conteúdo completo e simuladores interativos',
        login_google: 'Continuar com Google',
        login_github: 'Continuar com GitHub',
        terms_notice: 'Ao fazer login, você concorda com nossos termos de uso e política de privacidade.',
        error_google: 'Erro ao fazer login com Google. Por favor, tente novamente.',
        error_github: 'Erro ao fazer login com GitHub. Por favor, tente novamente.'
      },
      subscription: {
        title: 'Acesso Completo',
        subtitle: 'Invista em seu conhecimento e desenvolvimento profissional',
        limited_offer: 'Oferta Especial de Black November (50% OFF)',
        one_time_lifetime: 'Assinatura mensal - Acesso completo',
        buy_now: 'Comprar Agora',
        processing: 'Processando...',
        error_processing: 'Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.',
        select_currency: 'Selecione sua moeda',
        coupon_code: 'Código do Cupom (Opcional)',
        enter_coupon: 'Digite o código do cupom',
        clear_coupon: 'Limpar cupom',
        coupon_will_apply: 'Cupom "{{code}}" será aplicado no checkout',
        coupon_invalid_format: 'Formato de cupom inválido. Use 3-20 caracteres (letras, números, - ou _)',
        black_november_special: 'Preço Especial de Black November! (50% OFF)',
        use_coupon_hint: 'Use BLACKNOVEMBER para 50% OFF!',
        features: [
          'Acesso a todos os simuladores interativos',
          'Conteúdo completo sobre System Design',
          'Atualizações regulares de conteúdo',
          'Exemplos práticos do mundo real',
          'Suporte via comunidade',
          'Acesso completo ao conteúdo'
        ],
        why_buy_title: 'Por que comprar?',
        why_practical_title: 'Aprendizado Prático',
        why_practical_desc: 'Simuladores interativos que permitem experimentar cenários reais de sistemas distribuídos, facilitando a compreensão de conceitos complexos.',
        why_updated_title: 'Conteúdo Atualizado',
        why_updated_desc: 'Material constantemente atualizado com as últimas tendências e melhores práticas em sistemas de arquitetura.',
        why_career_title: 'Desenvolvimento Profissional',
        why_career_desc: 'Aprenda habilidades essenciais para avançar sua carreira como arquiteto ou engenheiro de software.',
        why_community_title: 'Comunidade',
        why_community_desc: 'Faça parte de uma comunidade de desenvolvedores, compartilhe experiências e aprenda com outros profissionais.',
        payment_confirmed: 'Pagamento Confirmado!',
        access_granted_redirect: 'Seu acesso foi liberado com sucesso. Redirecionando para o conteúdo...',
        monthly: 'Mensal',
        yearly: 'Anual',
        one_time: 'Pagamento único',
        monthly_plan: 'Mensal',
        yearly_plan: 'Anual',
        lifetime_plan: 'Acesso Vitalício',
        billed_monthly: 'Cobrado mensalmente',
        best_value: 'MELHOR VALOR',
        save: 'Economize',
        subscribe_now: 'Assinar Agora',
        cancel_anytime: 'Cancele quando quiser',
        lifetime_access_label: 'Acesso vitalício',
        lifetime_description: 'Pagamento único para manter acesso para sempre.',
        pay_once: 'Pague uma vez',
        get_lifetime_access: 'Garantir acesso vitalício',
        lifetime_note: 'Pagamento único. Acesso vitalício imediato.',
        lifetime_unavailable: 'Preço vitalício indisponível para esta moeda no momento.'
      },
      preferences: {
        title: 'Preferências',
        account_info: 'Informações da Conta',
        email: 'Email',
        creation_date: 'Data de Inscrição',
        manage_subscription: 'Gerenciar Assinatura',
        manage_subscription_desc: 'Gerencie sua assinatura, método de pagamento e histórico de faturas através do portal do Stripe.',
        privacy_cookies_title: 'Privacidade e Cookies',
        cookie_preferences_title: 'Preferências de Cookies',
        cookie_preferences_desc: 'Gerencie como coletamos e usamos dados em nosso site através de cookies.',
        manage_cookies_btn: 'Gerenciar Cookies',
        privacy_policy_title: 'Política de Privacidade',
        privacy_policy_desc: 'Saiba como coletamos, usamos e protegemos suas informações pessoais.',
        view_policy_btn: 'Ver Política',
        terms_title: 'Termos e Condições',
        terms_desc: 'Revise nossos termos de serviço e contrato de usuário.',
        view_terms_btn: 'Ver Termos'
      },
      privacy_policy: {
        title: 'Política de Privacidade',
        last_updated_label: 'Última atualização:',
        last_updated_date: 'Dezembro de 2024',
        sections: {
          info_collection: {
            title: '1. Informações que Coletamos',
            description: 'Coletamos informações que você fornece diretamente para nós, como quando você:',
            items: [
              'Cria uma conta ou faz login',
              'Assina nossos serviços',
              'Entra em contato para suporte',
              'Participa de pesquisas ou feedback'
            ]
          },
          use_info: {
            title: '2. Como Usamos Suas Informações',
            description: 'Usamos as informações que coletamos para:',
            items: [
              'Fornecer, manter e melhorar nossos serviços',
              'Processar transações e enviar informações relacionadas',
              'Enviar avisos técnicos e mensagens de suporte',
              'Responder aos seus comentários e perguntas',
              'Analisar padrões de uso para melhorar a experiência do usuário'
            ]
          },
          sharing: {
            title: '3. Compartilhamento de Informações',
            description: 'Não vendemos, trocamos ou transferimos suas informações pessoais para terceiros sem seu consentimento, exceto conforme descrito nesta política.',
            items_title: 'Podemos compartilhar suas informações nas seguintes situações:',
            items: [
              'Com provedores de serviço que nos ajudam a operar nossos serviços',
              'Para cumprir obrigações legais',
              'Para proteger nossos direitos e segurança',
              'Em conexão com uma transferência de negócio'
            ]
          },
          security: {
            title: '4. Segurança dos Dados',
            description: 'Implementamos medidas de segurança apropriadas para proteger suas informações pessoais contra acesso, alteração, divulgação ou destruição não autorizada.'
          },
          rights: {
            title: '5. Seus Direitos',
            description: 'Dependendo da sua localização, você pode ter certos direitos em relação às suas informações pessoais, incluindo:',
            items: [
              'O direito de acessar suas informações pessoais',
              'O direito de corrigir ou atualizar suas informações',
              'O direito de excluir suas informações',
              'O direito de restringir o processamento',
              'O direito à portabilidade de dados'
            ]
          },
          cookies: {
            title: '6. Cookies e Rastreamento',
            description: 'Utilizamos cookies e tecnologias de rastreamento similares para melhorar sua experiência. Para informações detalhadas sobre o uso de cookies, consulte nossa'
          },
          contact: {
            title: '7. Fale Conosco',
            description: 'Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato:',
            items: [
              'Email: flavio@trilha.info',
              'Através do formulário de contato no site'
            ]
          }
        },
        links: {
          terms: 'Termos e Condições',
          cookies: 'Política de Cookies',
          back_home: 'Voltar para o Dinamos'
        }
      },
      terms: {
        title: 'Termos e Condições',
        last_updated_label: 'Última atualização:',
        last_updated_date: 'Junho de 2026',
        sections: {
          acceptance: {
            title: '1. Aceitação dos Termos',
            paragraphs: [
              'Ao acessar e usar o Dinamos ("o Serviço"), você aceita e concorda em estar vinculado a estes Termos. Se não concordar, não utilize o Serviço.',
              'Podemos alterar estes Termos a qualquer momento. O uso contínuo do Serviço após alterações significa que você aceita os Termos atualizados.'
            ]
          },
          description: {
            title: '2. Descrição do Serviço',
            intro: 'O Dinamos é uma plataforma educacional focada em aprendizado de sistemas distribuídos. Nosso serviço inclui:',
            items: [
              'Conteúdo interativo e tutoriais',
              'Simuladores e ferramentas de system design',
              'Materiais educacionais e documentação',
              'Recursos de comunidade e acompanhamento de progresso',
              'Serviços de assinatura premium'
            ]
          },
          accounts: {
            title: '3. Contas de Usuário',
            intro: 'Para acessar certos recursos, é necessário registrar uma conta. Você concorda em:',
            items: [
              'Fornecer informações precisas e atualizadas',
              'Manter suas informações atualizadas',
              'Manter a segurança da sua senha e conta',
              'Nos notificar sobre uso não autorizado',
              'Assumir responsabilidade por todas as atividades em sua conta'
            ]
          },
          subscription: {
            title: '4. Serviços de Assinatura',
            intro: 'Alguns recursos exigem assinatura paga. Ao assinar, você concorda em:',
            items: [
              'Pagar todas as taxas aplicáveis ao seu plano',
              'Renovação automática salvo cancelamento antes da renovação',
              'Nossa política de reembolso conforme Seção 5',
              'Taxas não são reembolsáveis salvo exigência legal'
            ],
            note: 'Podemos alterar preços de assinatura com aviso razoável aos assinantes existentes.'
          },
          cancellation: {
            title: '5. Cancelamento e Reembolsos',
            intro: 'Você pode cancelar a qualquer momento. Após o cancelamento:',
            items: [
              'Você mantém acesso até o fim do período de faturamento',
              'Não há reembolsos proporcionais pelo tempo não utilizado',
              'Sua conta volta ao plano gratuito após a expiração'
            ],
            note: 'Reembolsos podem ser concedidos a nosso critério em casos de indisponibilidade ou circunstâncias excepcionais.'
          },
          ip_rights: {
            title: '6. Propriedade Intelectual e Atribuição',
            intro: 'Todo o conteúdo educacional do Serviço é gratuito para acessar, estudar e compartilhar. Pedimos apenas uma coisa em troca: sempre dê os créditos à plataforma. Sempre que você usar, referenciar ou reproduzir nosso conteúdo — incluindo em vídeos, cursos, aulas, apresentações, artigos, redes sociais ou qualquer outro meio — você deve:',
            items: [
              'Dar crédito claro e visível ao Dinamos (trilhainfo) como fonte do conteúdo',
              'Incluir um link para a plataforma (https://instagram.com/trilhainfo) sempre que o meio permitir',
              'Manter intactos os avisos de direitos autorais, marca ou autoria',
              'Não apresentar nosso conteúdo como se fosse seu nem sugerir endosso, parceria ou afiliação oficial sem permissão'
            ]
          },
          conduct: {
            title: '7. Conduta do Usuário',
            intro: 'Você concorda em não usar o Serviço para:',
            items: [
              'Violar leis ou regulamentos',
              'Transmitir conteúdo nocivo, ameaçador ou ofensivo',
              'Interferir ou interromper o Serviço ou servidores',
              'Tentar acesso não autorizado a outras contas',
              'Compartilhar credenciais da sua conta com terceiros',
              'Usar sistemas automatizados para acessar o Serviço'
            ]
          },
          availability: {
            title: '8. Disponibilidade do Serviço',
            intro: 'Buscamos confiabilidade, mas não garantimos disponibilidade ininterrupta. O Serviço pode ficar indisponível devido a:',
            items: [
              'Manutenções programadas',
              'Dificuldades técnicas',
              'Eventos de força maior',
              'Interrupções de serviços de terceiros'
            ],
            note: 'Podemos modificar, suspender ou descontinuar o Serviço com aviso razoável.'
          },
          privacy: {
            title: '9. Privacidade e Proteção de Dados',
            paragraphs: [
              'Sua privacidade é importante. A coleta e uso de informações pessoais são regidos por nossa Política de Privacidade, incorporada por referência.',
              'Ao usar o Serviço, você consente com nossas práticas de dados conforme descritas na Política de Privacidade.'
            ]
          },
          disclaimer: {
            title: '10. Isenção de Garantias',
            intro: 'O Serviço é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo, incluindo:',
            items: [
              'Comercialização ou adequação a um propósito específico',
              'Não violação de direitos de terceiros',
              'Precisão, completude ou confiabilidade do conteúdo',
              'Operação ininterrupta ou livre de erros'
            ]
          },
          liability: {
            title: '11. Limitação de Responsabilidade',
            intro: 'Na máxima extensão permitida por lei, o Dinamos não é responsável por danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo:',
            items: [
              'Perda de lucros, dados ou outros prejuízos intangíveis',
              'Danos decorrentes do uso ou impossibilidade de uso do Serviço',
              'Danos decorrentes de acesso não autorizado aos seus dados'
            ],
            note: 'A responsabilidade total é limitada ao valor pago pelo Serviço nos 12 meses anteriores à reclamação.'
          },
          indemnification: {
            title: '12. Indenização',
            intro: 'Você concorda em indenizar e isentar o Dinamos de reivindicações, danos, perdas ou despesas decorrentes de:',
            items: [
              'Seu uso do Serviço',
              'Sua violação destes Termos',
              'Sua violação de direitos de terceiros',
              'Conteúdo que você enviar ou compartilhar pelo Serviço'
            ]
          },
          termination: {
            title: '13. Rescisão',
            intro: 'Podemos encerrar ou suspender sua conta e acesso imediatamente, sem aviso, por motivos como:',
            items: [
              'Violação destes Termos',
              'Atividade fraudulenta ou ilegal',
              'Períodos prolongados de inatividade'
            ],
            note: 'Com a rescisão, seu direito de usar o Serviço cessa imediatamente; disposições sobre propriedade intelectual, isenções e limitações permanecem vigentes.'
          },
          governing_law: {
            title: '14. Legislação Aplicável',
            paragraphs: [
              'Estes Termos são regidos pelas leis do Brasil, sem considerar conflitos de leis.',
              'Disputas estão sujeitas à jurisdição exclusiva dos tribunais do Brasil.'
            ]
          },
          changes: {
            title: '15. Alterações nos Termos',
            intro: 'Podemos modificar estes Termos a qualquer momento. Em caso de mudanças materiais, notificaremos você por:',
            items: [
              'Publicação dos Termos atualizados nesta página',
              'Atualização da data de "Última atualização"',
              'Envio de aviso por e-mail ou pelo Serviço'
            ],
            note: 'O uso contínuo após as alterações constitui aceitação dos novos Termos.'
          },
          contact: {
            title: '16. Informações de Contato',
            intro: 'Se tiver dúvidas sobre estes Termos, entre em contato:',
            items: [
              'Email: flavio@trilha.info',
              'Através do formulário de contato no site'
            ]
          },
          severability: {
            title: '17. Divisibilidade',
            paragraphs: [
              'Se qualquer disposição for inexequível ou inválida, ela será limitada ou eliminada na extensão mínima necessária para que o restante dos Termos permaneça em pleno vigor.'
            ]
          }
        },
        links: {
          privacy: 'Política de Privacidade',
          cookies: 'Política de Cookies',
          back_home: 'Voltar para o Dinamos'
        }
      },
      coupon_modal: {
        welcome_title: 'Bem-vindo! 🎉',
        welcome_subtitle: 'Tenha acesso exclusivo com nossa oferta especial de Black November! (50% OFF)',
        coupon_code: 'Seu código de cupom exclusivo:',
        discount_amount: '50% OFF - Válido Todo Black November! (50% OFF)',
        features_title: 'O que você receberá:',
        feature_1: 'Curso completo de design de sistemas',
        feature_2: 'Simuladores interativos',
        feature_3: 'Estudos de caso do mundo real',
        feature_4: 'Acesso completo',
        subscribe_now: 'Assinar Agora e Economizar 50%',
        maybe_later: 'Talvez mais tarde',
        timer_note: 'Esta oferta é válida durante todo o mês de Black November! (50% OFF)'
      },
      landing: {
        hero_title: 'Domine Sistemas Distribuídos na Prática',
        hero_subtitle: 'A plataforma mais completa para aprender arquitetura de sistemas com simuladores interativos e casos reais',
        features_title: 'Conteúdo Completo e Prático',
        features_subtitle: 'Tudo que você precisa para se tornar um especialista em sistemas distribuídos',
        simulators_title: 'Aprenda com Simuladores Interativos',
        simulators_subtitle: 'Visualize e experimente conceitos complexos em tempo real',
        teacher_title: 'Quem vai te ensinar',
        teacher_experience_title: 'Experiência',
        teacher_experience_item1: '15+ anos de experiência em desenvolvimento de software',
        teacher_experience_item2: 'Liderança em empresas de tecnologia',
        teacher_experience_item3: 'Projetos em escala global',
        teacher_specialties_title: 'Especialidades',
        teacher_specialties_item1: 'Arquitetura de Sistemas Distribuídos',
        teacher_specialties_item2: 'Escalabilidade e Performance',
        teacher_specialties_item3: 'Segurança e Boas Práticas',
        teacher_about_me_text1: 'Olá! Me chamo Flávio, e atualmente atuo como Engineering Manager em Sistemas Distribuídos.',
        teacher_about_me_text2: 'Nesse material a minha intenção é poder colocar todos esses mais de 16 anos de experiência em prática, de forma que você saia daqui com uma mentalidade de que é necessário, além de ter um repertório técnico, colocar a mão na massa, experimentar e validar suas soluções.',
        teacher_about_me_text3: 'No meu dia a dia trabalho em projetos de alta performance, escalabilidade e disponibilidade onde atingimos mais de 1,5 bilhão de requisições por ano.',

        fundamentals_title: 'Fundamentos Sólidos',
        fundamentals_item1: 'Sistemas Distribuídos 101',
        fundamentals_item2: 'System Design 101',
        fundamentals_item3: 'Componentes Básicos',
        fundamentals_item4: 'Arquiteturas Modernas',

        real_cases_title: 'Casos Reais',
        real_cases_item1: 'Netflix e YouTube',
        real_cases_item2: 'WhatsApp e Uber',
        real_cases_item3: 'Spotify e Bit.ly',
        real_cases_item4: 'Decisões Técnicas',

        simulators_item1: 'Cache Simulator',
        simulators_item1_description: 'Entenda como o cache funciona e como ele melhora a performance dos sistemas',
        simulators_item2: 'Circuit Breaker',
        simulators_item2_description: 'Aprenda sobre tolerância a falhas e resiliência em sistemas distribuídos',
        simulators_item3: 'Load Balancer',
        simulators_item3_description: 'Explore diferentes estratégias de balanceamento de carga e suas aplicações',
        simulators_item4: 'Segurança e Proteção',

        journey_title: 'Sua Jornada de Aprendizado',
        journey_subtitle: 'Um caminho estruturado para dominar sistemas distribuídos',
        journey_fundamentals_title: 'Fundamentos',
        journey_fundamentals_item1: 'Sistemas Distribuídos 101',
        journey_fundamentals_item2: 'System Design 101',
        journey_fundamentals_item3: 'Componentes Básicos',
        journey_fundamentals_description: 'Aprenda os conceitos fundamentais e construa uma base sólida para sua jornada',
        journey_design_principles_title: 'Princípios de Design',
        journey_design_principles_item1: 'Escalabilidade Horizontal e Vertical',
        journey_design_principles_item2: 'Alta Disponibilidade',
        journey_design_principles_item3: 'Tolerância a Falhas',
        journey_design_principles_description: 'Domine os princípios essenciais de design de sistemas distribuídos',
        journey_advanced_topics_title: 'Tópicos Avançados',
        journey_advanced_topics_item1: 'Estratégias de Consistência',
        journey_advanced_topics_item2: 'Relógios Lógicos de Lamport',
        journey_advanced_topics_item3: 'Arquitetura Orientada a Eventos',
        journey_advanced_topics_description: 'Explore conceitos avançados e aprofunde seu conhecimento',
        journey_real_cases_title: 'Casos Reais',
        journey_real_cases_item1: 'YouTube e Netflix',
        journey_real_cases_item2: 'Spotify e WhatsApp',
        journey_real_cases_item3: 'Uber e Bit.ly',
        journey_real_cases_description: 'Aplique seu conhecimento analisando casos reais de sucesso',

        invest_title: 'Invista no Seu Futuro',
        invest_subtitle: 'Acesso completo a todo o conteúdo com uma assinatura mensal',
        invest_payment_info: 'Assinatura mensal - Acesso completo',
        new_offer_badge: 'Nova Oferta',
        what_you_receive_title: 'O Que Você Recebe',
        what_you_receive_item1: 'Mais de 15 simuladores interativos para prática hands-on',
        what_you_receive_item2: '6 estudos de caso detalhados de empresas de tecnologia',
        what_you_receive_item3: 'Conteúdo teórico completo com exemplos práticos',
        what_you_receive_item4: 'Atualizações e novos conteúdos incluídos',
        differentials_title: 'Diferenciais',
        differentials_item1: 'Simuladores exclusivos para praticar conceitos',
        differentials_item2: 'Análise detalhada de decisões técnicas reais',
        differentials_item3: 'Conteúdo em português e focado na prática',
        differentials_item4: 'Roadmap estruturado de aprendizado',
        cta_title: 'Pronto para se tornar um especialista?',
        cta_subtitle: 'Junte-se a centenas de desenvolvedores que já estão dominando sistemas distribuídos na prática',
        guarantee_spot: 'Garantir Minha Vaga',
        free_badge: 'GRÁTIS',
        free_title: 'Acesso Totalmente Gratuito',
        free_subtitle: 'Todo o conteúdo disponível sem custo. Aprenda sistemas distribuídos sem barreiras.',
        free_price: 'GRÁTIS',
        free_description: 'Acesso completo a todo conteúdo, simuladores e casos reais. Sem necessidade de cartão de crédito.',
        cta_free_title: 'Comece a Aprender Hoje!',
        cta_free_subtitle: 'Acesso completo a todo o conteúdo, 100% grátis. Sem assinatura necessária.',
        forum_section: {
          title: 'Fórum da Comunidade',
          subtitle: 'Últimas discussões da comunidade',
          view_all: 'Ver todos',
          see_more: '+{{count}} tópicos a mais'
        }
      },
      menu: {
        roadmap: {
          name: '🎯 Comece Aqui',
          description: 'Sua jornada de aprendizado passo a passo'
        },
        intro: {
          name: 'Introdução',
          description: 'Sobre o curso e motivação'
        },
        sistemas_distribuidos_101: {
          name: 'Sistemas Distribuídos 101',
          description: 'Conceitos fundamentais através de analogias'
        },
        system_design_101: {
          name: 'System Design 101',
          description: 'Fundamentos de design de sistemas'
        },
        theoretical_foundations: {
          name: 'Fundamentos Teóricos',
          description: 'Teoria e princípios fundamentais de sistemas distribuídos',
          cap_theorem: {
            name: 'Teorema CAP',
            description: 'Trade-offs entre Consistência, Disponibilidade e Tolerância a Partições',
            title: 'Teorema CAP',
            subtitle: 'Compreendendo os trade-offs fundamentais em sistemas distribuídos',
            introduction: 'Proposto por Eric Brewer em 2000, o teorema CAP é um dos conceitos mais importantes em sistemas distribuídos. Ele estabelece que qualquer sistema distribuído pode garantir apenas duas das três propriedades: Consistência, Disponibilidade e Tolerância a partições. Este teorema ajuda arquitetos a tomar decisões informadas sobre trade-offs no design de sistemas.',
            consistency: {
              title: 'Consistência',
              description: 'Todos os nós veem os mesmos dados ao mesmo tempo. Toda leitura recebe a escrita mais recente ou um erro.',
              detailed_explanation: 'Consistência significa que todos os nós no sistema distribuído têm a mesma visão dos dados a qualquer momento. Quando uma operação de escrita é concluída com sucesso, todas as operações de leitura subsequentes retornarão o valor atualizado até que os dados sejam alterados novamente.',
              concrete_examples: [
                'Sistema bancário: Quando você transfere R$ 100 da Conta A para a Conta B, todos os caixas eletrônicos devem mostrar os saldos corretos imediatamente',
                'Redes sociais: Quando você atualiza sua foto de perfil, todos os seus amigos devem ver a nova foto, não uma mistura de antiga e nova',
                'E-commerce: Quando um item sai de estoque, nenhum cliente deve conseguir comprá-lo de qualquer servidor',
                'Ranking de jogos: Quando um jogador atinge uma pontuação alta, todos os jogadores devem ver o ranking atualizado consistentemente'
              ],
              consistency_models: [
                'Consistência Forte: Todas as leituras recebem a escrita mais recente (PostgreSQL com replicação síncrona)',
                'Consistência Eventual: Sistema se tornará consistente ao longo do tempo (propagação DNS)',
                'Consistência Fraca: Sem garantias sobre quando a consistência será alcançada (streaming de vídeo ao vivo)'
              ]
            },
            availability: {
              title: 'Disponibilidade', 
              description: 'O sistema permanece operacional 100% do tempo. Toda requisição recebe uma resposta.',
              detailed_explanation: 'Disponibilidade significa que o sistema continua funcionando e respondendo a solicitações mesmo quando alguns componentes falham. Toda solicitação recebe uma resposta (sucesso ou falha) sem garantir que contenha a versão mais recente das informações.',
              concrete_examples: [
                'Netflix: Deve continuar reproduzindo vídeos mesmo se alguns servidores estiverem inativos, mesmo que recomendações possam estar desatualizadas',
                'Amazon: Site deve permanecer acessível durante picos de compras, mesmo que detalhes de produtos demorem para sincronizar',
                'WhatsApp: Mensagens devem ser entregues mesmo durante problemas de rede, mensagens podem ser entregues fora de ordem',
                'Google Search: Deve retornar resultados mesmo se alguns data centers estiverem inacessíveis, resultados podem estar ligeiramente desatualizados'
              ],
              availability_metrics: [
                '99% uptime = 3,65 dias de inatividade por ano',
                '99,9% uptime = 8,76 horas de inatividade por ano',
                '99,99% uptime = 52,56 minutos de inatividade por ano',
                '99,999% uptime = 5,26 minutos de inatividade por ano'
              ],
              strategies: [
                'Balanceamento de carga entre múltiplos servidores',
                'Sistemas redundantes e mecanismos de failover',
                'Degradação graciosa de funcionalidades',
                'Circuit breakers para prevenir falhas em cascata'
              ]
            },
            partition_tolerance: {
              title: 'Tolerância a Partições',
              description: 'O sistema continua operando apesar de falhas de rede entre os nós.',
              detailed_explanation: 'Tolerância a partições significa que o sistema continua funcionando mesmo quando falhas de rede impedem que alguns nós se comuniquem com outros. Isso não é opcional em sistemas distribuídos - falhas de rede são inevitáveis.',
              concrete_examples: [
                'Nuvem multi-região: Data centers da AWS na costa leste e oeste perdem conexão mas ambos continuam servindo usuários',
                'App móvel: Seu telefone perde internet mas dados em cache ainda funcionam, sincroniza quando conexão retorna',
                'Microserviços: Serviço de pagamento não consegue alcançar serviço de estoque mas ainda pode processar pagamentos com dados em cache',
                'CDN: Servidores edge locais servem conteúdo mesmo quando desconectados dos servidores de origem'
              ],
              partition_scenarios: [
                'Cabo de rede cortado entre data centers',
                'Falhas de roteador/switch isolam racks de servidores',
                'Interrupções de provedor de internet afetam regiões',
                'Ataques DDoS sobrecarregam infraestrutura de rede',
                'Firewalls mal configurados bloqueiam comunicação'
              ],
              handling_strategies: [
                'Detectar eventos de partição rapidamente',
                'Continuar operando com dados disponíveis',
                'Enfileirar operações para sincronização posterior',
                'Implementar mecanismos de resolução de conflitos'
              ]
            },
            theorem_statement: 'O Teorema CAP Estabelece:',
            theorem_text: 'Na presença de uma partição de rede, você deve escolher entre consistência e disponibilidade',
            real_world_note: 'Na prática, você não escolhe entre propriedades CAP para todo o seu sistema. Diferentes partes da sua aplicação podem fazer diferentes trade-offs baseados em requisitos de negócio.',
            concrete_examples_title: 'Exemplos Concretos',
            consistency_examples_title: 'Exemplos de Consistência',
            availability_examples_title: 'Exemplos de Disponibilidade',
            partition_examples_title: 'Exemplos de Tolerância a Partições',
            characteristics_label: 'Características:',
            examples_label: 'Exemplos:',
            use_cases_label: 'Casos de Uso:',
            limitations_label: 'Limitações:',
            cp_systems: {
              title: 'Sistemas CP (Consistência + Tolerância a Partições)',
              description: 'Priorizam consistência de dados sobre disponibilidade durante partições de rede',
              characteristics: [
                'Sistema fica indisponível durante partições',
                'Quando disponível, dados são sempre consistentes',
                'Melhor para dados financeiros/críticos'
              ],
              examples: [
                'Bancos de dados ACID tradicionais (PostgreSQL, MySQL) com replicação síncrona',
                'Apache HBase - garante consistência forte',
                'MongoDB com configurações de consistência forte',
                'Zookeeper - serviço de coordenação requerendo consenso',
                'Sistemas bancários onde precisão > disponibilidade'
              ],
              use_cases: [
                'Transações financeiras e bancárias',
                'Sistemas de gerenciamento de estoque',
                'Gerenciamento de configuração',
                'Sistemas de autenticação e autorização'
              ]
            },
            ap_systems: {
              title: 'Sistemas AP (Disponibilidade + Tolerância a Partições)', 
              description: 'Priorizam disponibilidade do sistema sobre consistência imediata durante partições',
              characteristics: [
                'Sistema permanece disponível durante partições',
                'Dados podem estar temporariamente inconsistentes',
                'Eventualmente se torna consistente quando partição se cura'
              ],
              examples: [
                'Amazon DynamoDB - banco NoSQL altamente disponível',
                'Apache Cassandra - banco distribuído priorizando disponibilidade',
                'Sistema DNS - deve sempre resolver nomes, consistência eventual é OK',
                'Amazon S3 - armazenamento de objetos com consistência eventual',
                'Feeds de redes sociais - melhor mostrar conteúdo ligeiramente desatualizado que ficar indisponível'
              ],
              use_cases: [
                'Plataformas de redes sociais',
                'Redes de entrega de conteúdo',
                'Sistemas de carrinho de compras',
                'Armazenamento de preferências do usuário',
                'Sistemas de analytics e logging'
              ]
            },
            ca_systems: {
              title: 'Sistemas CA (Consistência + Disponibilidade)', 
              description: 'Sistemas tradicionais que sacrificam tolerância a partições',
              characteristics: [
                'Consistência e disponibilidade perfeitas',
                'Funciona apenas em local único/sem partições de rede',
                'Não são verdadeiramente sistemas distribuídos'
              ],
              examples: [
                'Bancos de dados de nó único (PostgreSQL, MySQL em um servidor)',
                'Bancos em memória (Redis) em máquina única',
                'RDBMS tradicionais em data center único',
                'Aplicações monolíticas legadas'
              ],
              limitations: [
                'Não consegue lidar com partições de rede',
                'Ponto único de falha',
                'Não adequado para sistemas geograficamente distribuídos',
                'Escalabilidade limitada'
              ],
              note: 'Na prática, sistemas CA não existem em ambientes verdadeiramente distribuídos porque partições de rede são inevitáveis.'
            },
            practical_considerations: {
              title: 'Considerações Práticas',
              points: [
                'A maioria dos sistemas modernos são CP ou AP',
                'Você pode escolher diferentes trade-offs para diferentes partes do seu sistema',
                'Requisitos de negócio devem dirigir suas decisões CAP',
                'Monitore e meça consistência e disponibilidade reais',
                'Projete para degradação graciosa durante partições'
              ]
            },
            decision_framework: {
              title: 'Como Escolher?',
              questions: [
                'Seu negócio pode tolerar inconsistência temporária?',
                'Disponibilidade do sistema é mais importante que precisão dos dados?',
                'Você está operando em múltiplas regiões geográficas?',
                'Quais são os custos de inatividade vs. dados inconsistentes?',
                'Você pode implementar mecanismos de resolução de conflitos?'
              ]
            }
          },
          consistency_models: {
            name: 'Modelos de Consistência',
            description: 'Padrões de consistência forte, eventual e fraca',
            title: 'Modelos de Consistência',
            subtitle: 'Diferentes abordagens para gerenciar consistência de dados em sistemas distribuídos',
            introduction: 'Modelos de consistência definem as regras sobre quando e como atualizações de dados se tornam visíveis em um sistema distribuído. Compreender esses modelos é crucial para projetar sistemas que equilibram precisão de dados, performance e disponibilidade de acordo com seus requisitos específicos.',
            strong_consistency: {
              title: 'Consistência Forte',
              description: 'Todos os nós veem os mesmos dados ao mesmo tempo. Após uma operação de escrita, todas as leituras subsequentes retornarão o valor atualizado.',
              detailed_explanation: 'Consistência forte garante que uma vez que uma operação de escrita seja concluída com sucesso, todas as operações de leitura subsequentes retornarão o valor atualizado de qualquer nó no sistema. Isso fornece as garantias mais fortes, mas vem com trade-offs de performance e disponibilidade.',
              characteristics: [
                'Consistência imediata em todos os nós',
                'Nunca retorna dados obsoletos aos clientes',
                'Garantias de transações ACID',
                'Replicação síncrona necessária',
                'Maior latência devido ao overhead de coordenação'
              ],
              concrete_examples: [
                'Transferência bancária: Quando você transfere dinheiro, ambas as contas devem mostrar saldos corretos imediatamente em todos os caixas eletrônicos e agências',
                'Gestão de estoque: Quando o último item é vendido, nenhum outro cliente deve conseguir comprá-lo de qualquer localização',
                'Autenticação de usuário: Mudanças de senha devem ser efetivas imediatamente em todos os servidores de login',
                'Negociação de ações: Execução de ordens deve refletir imediatamente em todos os sistemas de negociação para prevenir arbitragem'
              ],
              implementations: [
                'PostgreSQL com replicação síncrona',
                'MongoDB com write concern de maioria',
                'Protocolo de consenso Apache Zookeeper',
                'Google Spanner com TrueTime',
                'RDBMS tradicionais com transações distribuídas'
              ],
              use_cases: [
                'Transações financeiras e sistemas bancários',
                'Gestão de estoque e inventário',
                'Autenticação e autorização de usuários',
                'Sistemas de conformidade regulatória',
                'Aplicações empresariais críticas'
              ],
              tradeoffs: 'Trade-offs: Alta consistência mas pode impactar disponibilidade e performance'
            },
            eventual_consistency: {
              title: 'Consistência Eventual',
              description: 'O sistema se tornará consistente com o tempo, desde que não receba novas atualizações. Leituras podem retornar dados obsoletos temporariamente.',
              detailed_explanation: 'Consistência eventual garante que se nenhuma nova atualização for feita a um item de dados, eventualmente todos os acessos a esse item retornarão o valor atualizado. Este modelo permite inconsistências temporárias mas garante alta disponibilidade e tolerância a partições.',
              characteristics: [
                'Inconsistências temporárias permitidas',
                'Alta disponibilidade e tolerância a partições',
                'Replicação assíncrona',
                'Menor latência para operações de escrita',
                'Mecanismos de resolução de conflitos necessários'
              ],
              concrete_examples: [
                'Timeline de redes sociais: Sua postagem aparece imediatamente para você, mas pode demorar para aparecer nos feeds dos amigos',
                'Propagação DNS: Mudanças de domínio levam tempo para propagar globalmente, servidores DNS diferentes podem retornar IPs diferentes temporariamente',
                'Avaliações de produtos Amazon: Avaliações aparecem eventualmente em todos os servidores, mas consistência imediata não é crítica',
                'Sistemas de email: Emails se replicam para servidores de backup ao longo do tempo, atrasos temporários não quebram a funcionalidade'
              ],
              implementations: [
                'Amazon DynamoDB com leituras de consistência eventual',
                'Apache Cassandra nível de consistência padrão',
                'Amazon S3 armazenamento de objetos',
                'DNS (Sistema de Nomes de Domínio)',
                'Bancos NoSQL com replicação assíncrona'
              ],
              use_cases: [
                'Feeds e interações de redes sociais',
                'Sistemas de gerenciamento de conteúdo',
                'Armazenamento de preferências de usuário',
                'Sistemas de carrinho de compras',
                'Dados de analytics e logging'
              ],
              convergence_strategies: [
                'Last-write-wins (baseado em timestamp)',
                'Vector clocks para rastreamento de causalidade',
                'Tipos de dados replicados livres de conflito (CRDTs)',
                'Resolução de conflitos no nível da aplicação',
                'Controle de concorrência multi-versão'
              ],
              tradeoffs: 'Trade-offs: Alta disponibilidade e tolerância a partições, mas inconsistência temporária'
            },
            weak_consistency: {
              title: 'Consistência Fraca',
              description: 'Após uma escrita, leituras podem ou não ver o valor atualizado. O sistema não faz garantias sobre quando os dados estarão consistentes.',
              detailed_explanation: 'Consistência fraca não faz garantias sobre quando os dados se tornarão consistentes entre os nós. Este modelo prioriza máxima performance e disponibilidade, aceitando que dados podem estar inconsistentes por períodos estendidos ou mesmo permanentemente em alguns casos.',
              characteristics: [
                'Nenhuma garantia de consistência',
                'Máxima performance e throughput',
                'Propagação de dados por melhor esforço',
                'Overhead mínimo de coordenação',
                'Aplicação deve lidar com inconsistências'
              ],
              concrete_examples: [
                'Streaming de vídeo ao vivo: Perda de frames ou mudanças de qualidade são aceitáveis para performance em tempo real',
                'Jogos online: Posições de jogadores podem estar ligeiramente dessincronizadas para melhor responsividade',
                'Colaboração em tempo real: Posições de cursor em documentos compartilhados não precisam de consistência perfeita',
                'Dados de sensores IoT: Perda ocasional de dados é aceitável para leituras de sensores de alta frequência'
              ],
              implementations: [
                'Cache distribuído Memcached',
                'Redis sem persistência',
                'Sistemas em tempo real baseados em UDP',
                'Filas de mensagens por melhor esforço',
                'Plataformas de streaming em tempo real'
              ],
              use_cases: [
                'Jogos e simulações em tempo real',
                'Streaming de vídeo/áudio ao vivo',
                'Coleta de dados de sensores de alta frequência',
                'Ferramentas de colaboração em tempo real',
                'Monitoramento de performance e métricas'
              ],
              considerations: [
                'Aplicação deve ser projetada para inconsistência',
                'Perda de dados pode ser permanente',
                'Resolução de conflitos no cliente frequentemente necessária',
                'Adequado apenas para dados não críticos',
                'Monitoramento se torna crucial'
              ],
              tradeoffs: 'Trade-offs: Máxima performance e disponibilidade, garantias mínimas de consistência'
            },
            choosing_title: 'Escolhendo o Modelo Certo',
            use_cases: {
              strong: 'Transações financeiras, sistemas de inventário, autenticação de usuário',
              eventual: 'Feeds de redes sociais, comentários, perfis de usuário, carrinhos de compra',
              weak: 'Streaming de vídeo ao vivo, jogos online, colaboração em tempo real'
            },
            decision_matrix: {
              title: 'Matriz de Decisão',
              factors: [
                'Criticidade dos dados: Quão importante é a precisão dos dados?',
                'Requisitos de performance: Qual latência é aceitável?',
                'Necessidades de disponibilidade: O sistema pode tolerar downtime?',
                'Requisitos de escala: Quantos usuários simultâneos?',
                'Distribuição geográfica: Múltiplas regiões ou data centers?'
              ]
            },
            practical_guidelines: {
              title: 'Diretrizes Práticas de Implementação',
              tips: [
                'Diferentes partes do seu sistema podem usar diferentes modelos de consistência',
                'Comece com consistência forte e relaxe apenas onde necessário',
                'Monitore métricas de consistência em produção',
                'Projete estratégias de resolução de conflitos antecipadamente',
                'Considere abordagens híbridas para aplicações complexas'
              ]
            },
            examples_title: 'Exemplos do Mundo Real',
            characteristics_label: 'Características:',
            examples_label: 'Exemplos:',
            implementations_label: 'Implementações:',
            use_cases_label: 'Casos de Uso:',
            convergence_label: 'Estratégias de Convergência:',
            considerations_label: 'Considerações:'
          },
          distributed_challenges: {
            name: 'Desafios Distribuídos',
            description: 'Problemas comuns em sistemas distribuídos',
            title: 'Desafios de Sistemas Distribuídos',
            subtitle: 'Problemas e complexidades comuns na computação distribuída',
            introduction: 'Sistemas distribuídos enfrentam desafios únicos que não existem em sistemas de uma única máquina. Compreender esses problemas fundamentais é crucial para projetar aplicações distribuídas resilientes, escaláveis e confiáveis. Cada desafio requer consideração cuidadosa e soluções específicas.',
            network_partitions: {
              title: 'Partições de Rede',
              description: 'Falhas de rede que dividem o sistema em grupos isolados, forçando trade-offs entre consistência e disponibilidade.',
              detailed_explanation: 'Partições de rede ocorrem quando falhas de rede impedem que alguns nós se comuniquem com outros, efetivamente dividindo o sistema em grupos isolados. Este é um dos problemas mais desafiadores em sistemas distribuídos porque força decisões imediatas sobre consistência vs. disponibilidade.',
              characteristics: [
                'Falha de comunicação entre nós',
                'Sistema se divide em ilhas isoladas',
                'Trade-offs imediatos do teorema CAP necessários',
                'Pode ser temporário ou permanente',
                'Afeta garantias de consistência de dados'
              ],
              concrete_examples: [
                'Conectividade de data center: Cabo cortado entre regiões AWS causa partição de 6 horas, cada região deve decidir se permanece online',
                'Microserviços: Serviço de pagamento não consegue alcançar serviço de estoque, deve decidir se processa pedidos com dados de estoque obsoletos',
                'Cluster de banco: Replicação master-slave quebra, slaves devem decidir se aceitam escritas ou permanecem somente leitura',
                'Rede CDN: Problemas de roteamento isolam servidores edge da origem, conteúdo em cache fica obsoleto mas usuários ainda são servidos'
              ],
              causes: [
                'Falhas físicas de rede (corte de cabos, falhas de roteador)',
                'Bugs de software na pilha de rede',
                'Infraestrutura de rede sobrecarregada',
                'Incidentes de segurança (ataques DDoS)',
                'Erros de configuração no roteamento'
              ],
              detection_strategies: [
                'Mecanismos de heartbeat entre nós',
                'Detecção de falhas baseada em timeout',
                'Protocolos de gossip para associação',
                'Sistemas de monitoramento externos',
                'Verificações de saúde no nível da rede'
              ],
              mitigation_approaches: [
                'Múltiplos caminhos de rede e redundância',
                'Estratégias de degradação graciosa',
                'Circuit breakers para serviços com falha',
                'Modo somente leitura durante partições',
                'Resolução de conflitos para cura de partições'
              ],
              impact: 'Impacto: Perda de comunicação entre nós, potencial inconsistência de dados'
            },
            clock_sync: {
              title: 'Sincronização de Relógio',
              description: 'Diferentes nós têm relógios diferentes, dificultando ordenar eventos e manter consistência.',
              detailed_explanation: 'Sincronização de relógio é fundamental para sistemas distribuídos porque os nós têm relógios independentes que derivam em taxas diferentes. Sem tempo sincronizado, torna-se quase impossível ordenar eventos, manter causalidade ou implementar algoritmos baseados em tempo corretamente.',
              characteristics: [
                'Relógios derivam em taxas diferentes',
                'Não há noção global de "agora"',
                'Ordenação de eventos se torna ambígua',
                'Impacta timestamps e logs',
                'Crítico para algoritmos distribuídos'
              ],
              concrete_examples: [
                'Transações bancárias: Transferência parece completar antes de começar devido ao skew de relógio, causando falhas de auditoria',
                'Log distribuído: Logs de erro aparecem fora de ordem entre serviços, tornando debug impossível',
                'Invalidação de cache: TTL expira em tempos diferentes em nós diferentes, causando dados obsoletos',
                'Gerenciamento de lease: Locks distribuídos expiram em tempos diferentes, levando a cenários split-brain'
              ],
              problems_caused: [
                'Ordenação incorreta de eventos em logs',
                'Condições de corrida em lógica baseada em tempo',
                'Expiração inconsistente de cache',
                'Falhas de lock distribuído',
                'Corrupção de trilha de auditoria'
              ],
              sync_approaches: [
                'Network Time Protocol (NTP)',
                'Precision Time Protocol (PTP)',
                'Sincronização baseada em GPS',
                'Referências de relógio atômico',
                'API Google TrueTime'
              ],
              logical_alternatives: [
                'Timestamps Lamport para causalidade',
                'Vector clocks para ordenação parcial',
                'Hybrid logical clocks (HLC)',
                'Ordenação baseada em eventos em vez de tempo',
                'Números de sequência baseados em consenso'
              ],
              solutions: 'Soluções: Relógios lógicos, Relógios vetoriais, NTP'
            },
            partial_failures: {
              title: 'Falhas Parciais',
              description: 'Algumas partes do sistema falham enquanto outras continuam funcionando, criando estados inconsistentes.',
              detailed_explanation: 'Falhas parciais são talvez o desafio mais insidioso em sistemas distribuídos. Diferente de falhas completas do sistema que são óbvias, falhas parciais criam cenários onde alguns componentes funcionam enquanto outros falham, levando a estados inconsistentes difíceis de detectar e lidar.',
              characteristics: [
                'Apenas subconjunto de componentes do sistema falha',
                'Difícil de detectar e diagnosticar',
                'Pode causar falhas em cascata',
                'Sistema parece parcialmente funcional',
                'Cria estado global inconsistente'
              ],
              concrete_examples: [
                'Checkout e-commerce: Pagamento processado mas estoque não atualizado devido a falha do banco, ocorre overselling',
                'Sistema de email: Mensagem entregue para alguns destinatários mas não outros devido a falhas de servidor',
                'Redes sociais: Post visível para alguns usuários mas não outros devido a lag de replicação',
                'Armazenamento de arquivo: Dados escritos no primário mas replicação para backups falha, risco de perda de dados aumenta'
              ],
              failure_types: [
                'Fail-stop: Componente para completamente',
                'Fail-slow: Componente responde muito lentamente',
                'Byzantine: Componente se comporta arbitrariamente',
                'Omissão: Componente descarta algumas mensagens',
                'Comissão: Componente envia dados errados'
              ],
              detection_challenges: [
                'Nenhum sinal claro de falha',
                'Timeouts são ambíguos',
                'Falhas de rede vs. nó não claras',
                'Corrupção silenciosa de dados possível',
                'Atualizações parciais de estado'
              ],
              handling_strategies: [
                'Verificações de saúde abrangentes',
                'Padrão circuit breaker',
                'Degradação graciosa',
                'Transações de compensação',
                'Operações idempotentes'
              ],
              challenges: 'Desafios: Detectar falhas, lidar com timeouts, estratégias de recuperação'
            },
            consensus: {
              title: 'Consenso',
              description: 'Fazer nós distribuídos concordarem com um único valor ou decisão na presença de falhas.',
              detailed_explanation: 'Consenso é o problema de fazer múltiplos nós distribuídos concordarem com um único valor, mesmo quando alguns nós podem falhar ou se comportar maliciosamente. Isso é fundamental para muitas operações de sistemas distribuídos como eleição de líder, gerenciamento de configuração e garantia de consistência.',
              characteristics: [
                'Todos os nós corretos devem concordar',
                'Deve lidar com falhas de nó',
                'Deve terminar em tempo finito',
                'Garantias de segurança e vivacidade',
                'Base para muitos protocolos distribuídos'
              ],
              concrete_examples: [
                'Cluster de banco: Nós devem concordar sobre quais transações commitar em que ordem',
                'Cluster Kubernetes: Nós devem concordar sobre quais pods estão rodando onde',
                'Blockchain: Mineradores devem concordar sobre o próximo bloco na cadeia',
                'Gerenciamento de configuração: Serviços devem concordar sobre versão atual de configuração'
              ],
              problem_variants: [
                'Tolerância a falhas bizantinas: Lidar com nós maliciosos',
                'Tolerância a falhas de crash: Lidar apenas com falhas de crash',
                'Eleição de líder: Escolher coordenador único',
                'Broadcast atômico: Ordenar todas as mensagens',
                'Replicação de máquina de estado: Manter réplicas sincronizadas'
              ],
              famous_algorithms: [
                'Paxos: Consenso clássico com garantias fortes',
                'Raft: Alternativa mais simples ao Paxos',
                'PBFT: Consenso tolerante a falhas bizantinas',
                'Impossibilidade FLP: Limitações teóricas',
                'RAFT: Consenso baseado em líder para replicação de log'
              ],
              real_world_usage: [
                'Apache Zookeeper usa protocolo Zab',
                'etcd e Consul usam Raft',
                'Google Spanner usa Paxos',
                'Redes blockchain usam Proof of Work/Stake',
                'Protocolos de replicação de banco'
              ],
              algorithms: 'Algoritmos: Raft, PBFT, Paxos'
            },
            state_management: {
              title: 'Gerenciamento de Estado',
              description: 'Manter controle do estado do sistema em múltiplos nós ao lidar com atualizações concorrentes.',
              detailed_explanation: 'Gerenciamento de estado em sistemas distribuídos envolve manter estado consistente entre múltiplos nós enquanto lida com atualizações concorrentes, falhas e partições de rede. Este desafio se torna exponencialmente mais complexo conforme o número de nós e a frequência de atualizações aumentam.',
              characteristics: [
                'Estado distribuído entre nós',
                'Atualizações concorrentes de múltiplas fontes',
                'Deve lidar com falhas de nó graciosamente',
                'Trade-offs consistência vs. performance',
                'Requer mecanismos de coordenação'
              ],
              concrete_examples: [
                'Carrinho de compras: Usuário adiciona itens do app móvel enquanto simultaneamente do web, ambas atualizações devem ser preservadas',
                'Jogo multiplayer: Atualizações de posição do jogador de múltiplos clientes devem ser reconciliadas em tempo real',
                'Documento colaborativo: Múltiplos usuários editando mesmo documento simultaneamente',
                'Sistema de estoque: Múltiplos armazéns atualizando níveis de estoque concorrentemente'
              ],
              consistency_challenges: [
                'Consistência read-after-write',
                'Consistência de leitura monotônica',
                'Consistência de sessão',
                'Garantias de consistência eventual',
                'Requisitos de consistência forte'
              ],
              concurrency_issues: [
                'Problema de atualizações perdidas',
                'Leituras sujas de dados não commitados',
                'Leituras não repetíveis',
                'Leituras fantasma em consultas de intervalo',
                'Conflitos write-write'
              ],
              architectural_patterns: [
                'Event sourcing: Armazenar eventos, não estado',
                'CQRS: Separar modelos de comando e consulta',
                'Padrão Saga: Gerenciar transações distribuídas',
                'Two-phase commit: Garantir atomicidade',
                'Transações baseadas em compensação'
              ],
              approaches: 'Abordagens: Event sourcing, CQRS, máquinas de estado distribuídas'
            },
            race_conditions: {
              title: 'Condições de Corrida',
              description: 'Múltiplos processos acessando recursos compartilhados simultaneamente, levando a resultados imprevisíveis.',
              detailed_explanation: 'Condições de corrida em sistemas distribuídos ocorrem quando múltiplos processos ou nós tentam acessar e modificar recursos compartilhados simultaneamente, levando a resultados imprevisíveis e frequentemente incorretos. Diferente de condições de corrida em máquina única, condições de corrida distribuídas são mais difíceis de detectar e debugar.',
              characteristics: [
                'Ordem de execução não determinística',
                'Contenção de recursos compartilhados',
                'Bugs dependentes de timing',
                'Difícil de reproduzir',
                'Pode causar corrupção de dados'
              ],
              concrete_examples: [
                'Conta bancária: Dois caixas eletrônicos saque simultaneamente, ambos verificam saldo (R$ 100), ambos permitem saque de R$ 60, conta fica negativa',
                'Reserva de passagem: Dois clientes reservam último assento simultaneamente, ambos recebem confirmação, avião oversold',
                'Incremento de contador: Múltiplos serviços incrementam contador global, valor final incorreto devido a atualizações perdidas',
                'Alocação de recursos: Dois processos alocam mesmos recursos de servidor, causando conflitos de recursos'
              ],
              common_scenarios: [
                'Operações check-then-act',
                'Ciclos read-modify-write',
                'Padrões double-checked locking',
                'Condições de corrida de inicialização',
                'Condições de corrida de limpeza'
              ],
              distributed_complications: [
                'Atrasos de rede mascaram problemas de timing',
                'Falhas parciais durante operações',
                'Problemas de sincronização de relógio',
                'Efeitos de reordenação de mensagens',
                'Falhas de lock distribuído'
              ],
              prevention_techniques: [
                'Operações atômicas e Compare-And-Swap',
                'Mecanismos de locking distribuído',
                'Garantias de ordenação de mensagens',
                'Controle de concorrência otimista',
                'Estratégias de locking pessimista'
              ],
              solutions: 'Soluções: Locks, operações atômicas, ordenação de mensagens'
            },
            fallacies_title: 'As Falácias da Computação Distribuída',
            fallacies: {
              f1: 'A rede é confiável',
              f2: 'A latência é zero',
              f3: 'A largura de banda é infinita',
              f4: 'A rede é segura',
              f5: 'A topologia não muda',
              f6: 'Há um administrador',
              f7: 'O custo de transporte é zero',
              f8: 'A rede é homogênea'
            },
            fallacies_warning: 'Essas suposições falsas levam a muitos problemas em sistemas distribuídos',
            fallacies_explanation: 'As Oito Falácias da Computação Distribuída, identificadas por Peter Deutsch e outros, representam equívocos comuns que desenvolvedores cometem ao projetar sistemas distribuídos. Compreender essas falácias é crucial para construir aplicações distribuídas robustas.',
            mitigation_strategies: {
              title: 'Estratégias Gerais de Mitigação',
              strategies: [
                'Projetar para falha: Assumir que componentes vão falhar',
                'Implementar monitoramento abrangente e alertas',
                'Usar circuit breakers para prevenir falhas em cascata',
                'Construir capacidades de degradação graciosa',
                'Testar cenários de falha regularmente (chaos engineering)',
                'Implementar logging adequado e rastreamento distribuído',
                'Usar operações idempotentes quando possível',
                'Projetar para consistência eventual quando apropriado'
              ]
            },
            characteristics_label: 'Características:',
            examples_label: 'Exemplos:',
            causes_label: 'Causas Comuns:',
            detection_label: 'Estratégias de Detecção:',
            mitigation_label: 'Abordagens de Mitigação:',
            problems_label: 'Problemas Causados:',
            approaches_label: 'Abordagens:',
            algorithms_label: 'Algoritmos:',
            usage_label: 'Uso no Mundo Real:',
            patterns_label: 'Padrões Arquiteturais:',
            techniques_label: 'Técnicas de Prevenção:',
            scenarios_label: 'Cenários Comuns:',
            complications_label: 'Complicações Distribuídas:',
            sync_approaches_label: 'Abordagens de Sincronização:',
            logical_alternatives_label: 'Alternativas Lógicas:',
            failure_types_label: 'Tipos de Falha:',
            detection_challenges_label: 'Desafios de Detecção:',
            handling_strategies_label: 'Estratégias de Tratamento:',
            problem_variants_label: 'Variantes do Problema:',
            consistency_challenges_label: 'Desafios de Consistência:',
            concurrency_issues_label: 'Problemas de Concorrência:'
          },
          network_partitions: {
            name: 'Partições de Rede e Falhas',
            description: 'Lidando com divisões de rede e falhas de nós',
            title: 'Partições de Rede e Falhas',
            subtitle: 'Compreendendo e lidando com divisões de rede e falhas de nós em sistemas distribuídos',
            introduction: 'Partições de rede são um dos problemas mais fundamentais e desafiadores em sistemas distribuídos. Quando falhas de rede impedem a comunicação entre nós, sistemas devem tomar decisões críticas sobre consistência versus disponibilidade. Compreender como detectar, prevenir e lidar com partições é essencial para construir aplicações distribuídas resilientes.',
            what_is: {
              title: 'O que é uma Partição de Rede?',
              description: 'Uma partição de rede ocorre quando a rede entre nós falha, dividindo o sistema em grupos isolados que não conseguem se comunicar.',
              detailed_explanation: 'Partições de rede representam um modo de falha onde o sistema distribuído se torna dividido em ilhas isoladas de nós que podem se comunicar internamente mas não através da fronteira da partição. Isso é particularmente desafiador porque cada partição pode continuar operando independentemente, potencialmente tomando decisões conflitantes.',
              note: 'Também conhecido como cenário "split-brain", onde diferentes partes do sistema podem tomar decisões independentes, potencialmente levando à inconsistência.',
              characteristics: [
                'Comunicação entre grupos de nós é impossível',
                'Cada partição pode tomar decisões independentes',
                'Trade-offs do teorema CAP se tornam imediatamente relevantes',
                'Estado do sistema pode divergir entre partições',
                'Recuperação requer estratégias de resolução de conflitos'
              ]
            },
            causes: {
              title: 'Causas das Partições',
              description: 'Partições de rede podem surgir de várias questões de infraestrutura e configuração que afetam a conectividade entre nós distribuídos.',
              items: [
                'Falhas de roteador ou switch',
                'Cortes ou danos em cabos', 
                'Interrupções de ISP ou datacenter',
                'Bugs de software na pilha de rede',
                'Firewalls mal configurados'
              ],
              detailed_causes: [
                'Falhas de infraestrutura física: Cortes de cabo, falhas de hardware de roteador, quedas de energia afetando equipamentos de rede',
                'Bugs de software: Bugs na pilha de rede, problemas de driver, falhas de protocolo de roteamento, problemas de resolução DNS',
                'Erros de configuração: Configurações incorretas de firewall, erros de tabela de roteamento, conflitos de política de segurança',
                'Condições de sobrecarga: Congestionamento de rede, ataques DDoS, esgotamento de recursos causando perda de pacotes',
                'Fatores ambientais: Desastres naturais, acidentes de construção, interferência eletromagnética'
              ]
            },
            failure_types: {
              title: 'Tipos de Falhas',
              description: 'Diferentes modos de falha requerem diferentes estratégias de detecção e tratamento em sistemas distribuídos.',
              fail_stop: {
                title: 'Fail-Stop',
                description: 'Nó para completamente e outros nós podem detectar a falha',
                detailed_explanation: 'Em falhas fail-stop, um nó cessa completamente a operação e para de responder a todas as solicitações. Este é o tipo mais fácil de falha para detectar e lidar porque a falha é limpa e observável por outros nós.',
                characteristics: [
                  'Nó para de responder completamente',
                  'Fácil de detectar com timeouts',
                  'Sem risco de corrupção parcial de estado',
                  'Semânticas de falha limpas'
                ],
                examples: [
                  'Falha de energia do servidor causando desligamento imediato',
                  'Crash de processo devido a condição de falta de memória',
                  'Falha de interface de rede tornando nó inacessível',
                  'Terminação de container ou VM'
                ]
              },
              fail_slow: {
                title: 'Fail-Slow', 
                description: 'Nó fica muito lento mas não falha completamente',
                detailed_explanation: 'Falhas fail-slow são particularmente insidiosas porque o nó continua a operar mas com performance severamente degradada. Isso pode causar timeouts, falhas em cascata e tornar difícil distinguir entre latência de rede e problemas do nó.',
                characteristics: [
                  'Nó responde mas muito lentamente',
                  'Difícil de distinguir de latência de rede',
                  'Pode causar problemas de performance em cascata',
                  'Pode levar ao esgotamento de recursos em outros nós'
                ],
                examples: [
                  'Sobrecarga de CPU causando atrasos no processamento de requisições',
                  'Pressão de memória levando a coleta de lixo excessiva',
                  'Gargalos de I/O de disco retardando operações',
                  'Congestionamento de rede causando atrasos intermitentes'
                ]
              },
              byzantine: {
                title: 'Bizantina',
                description: 'Nó se comporta arbitrariamente ou maliciosamente',
                detailed_explanation: 'Falhas bizantinas representam o modo de falha mais complexo onde nós podem enviar mensagens conflitantes, corrompidas ou maliciosas. Essas falhas requerem algoritmos de consenso sofisticados e são especialmente importantes em ambientes adversários.',
                characteristics: [
                  'Nó envia mensagens incorretas ou conflitantes',
                  'Pode parecer funcionar corretamente para alguns nós',
                  'Requer acordo de maioria para lidar',
                  'Tipo mais difícil de falha para detectar e lidar'
                ],
                examples: [
                  'Corrupção de memória causando computações incorretas',
                  'Bugs de software levando a respostas inconsistentes',
                  'Ataques maliciosos tentando comprometer consenso',
                  'Skew de relógio causando inconsistências de timestamp'
                ]
              }
            },
            concrete_examples: {
              title: 'Cenários Reais de Partição',
              examples: [
                'Isolamento de região AWS: Falha de rede inter-regional isola US-East de US-West, cada região continua servindo tráfego independentemente',
                'Divisão de cluster de banco: Replicação master-slave quebra, slaves devem decidir se aceitam escritas ou permanecem somente leitura para prevenir conflitos',
                'Partição de microserviços: Serviço de pagamento perde conexão com serviço de estoque durante checkout, deve decidir se processa pedidos com dados de estoque obsoletos',
                'Isolamento de edge CDN: Problemas de roteamento de internet isolam servidores edge da origem, conteúdo em cache fica obsoleto mas usuários continuam sendo servidos',
                'Partição de cluster Kubernetes: Nós worker perdem conexão com master, pods continuam rodando mas novos deployments falham'
              ]
            },
            partition_scenarios: {
              title: 'Cenários Comuns de Partição',
              datacenter_split: {
                title: 'Partições Multi-Datacenter',
                description: 'Quando datacenters perdem conectividade, cada um deve decidir como lidar com operações em andamento',
                strategies: [
                  'Designar datacenter primário para escritas',
                  'Mudar para modo somente leitura em datacenters secundários',
                  'Usar consenso para eleger novo primário',
                  'Implementar estruturas de dados livres de conflito'
                ]
              },
              service_mesh_partition: {
                title: 'Partições de Service Mesh',
                description: 'Quando serviços em uma mesh perdem conectividade com subconjuntos de outros serviços',
                strategies: [
                  'Padrão circuit breaker para falhar rapidamente',
                  'Fallback para respostas em cache',
                  'Degradação graciosa de funcionalidade',
                  'Enfileirar requisições para processamento posterior'
                ]
              },
              database_partition: {
                title: 'Partições de Cluster de Banco',
                description: 'Quando nós de banco se tornam isolados uns dos outros',
                strategies: [
                  'Usar escritas baseadas em quorum para manter consistência',
                  'Mudar partições minoritárias para modo somente leitura',
                  'Implementar resolução de conflito last-write-wins',
                  'Usar vector clocks para rastreamento de causalidade'
                ]
              }
            },
            handling_title: 'Estratégias de Tratamento',
            detection: {
              title: 'Detecção',
              description: 'Detecção precoce e precisa de partições de rede é crucial para implementar estratégias de resposta apropriadas.',
              items: [
                'Mecanismos de heartbeat',
                'Detecção baseada em timeout',
                'Protocolos de gossip',
                'Monitoramento externo'
              ],
              detailed_strategies: [
                'Mecanismos de heartbeat: Mensagens ping/pong regulares entre nós para detectar perda de conectividade',
                'Detecção baseada em timeout: Definir timeouts razoáveis para distinguir respostas lentas de falhas',
                'Protocolos de gossip: Detecção de falhas distribuída onde nós compartilham informações sobre outros nós',
                'Monitoramento externo: Serviços terceirizados para validar conectividade de múltiplas perspectivas',
                'Sondas no nível da aplicação: Verificações de saúde específicas para funcionalidade de lógica de negócio'
              ],
              challenges: [
                'Distinguir entre atrasos de rede e partições reais',
                'Falsos positivos devido a congestionamento temporário de rede',
                'Definir valores de timeout apropriados para diferentes cenários',
                'Lidar com conectividade parcial (alguns nós alcançáveis, outros não)'
              ]
            },
            prevention: {
              title: 'Prevenção',
              description: 'Embora partições não possam ser completamente prevenidas, sua probabilidade e impacto podem ser significativamente reduzidos através de design apropriado de infraestrutura.',
              items: [
                'Caminhos de rede redundantes',
                'Múltiplos datacenters',
                'Equipamentos de rede de qualidade',
                'Manutenção regular'
              ],
              detailed_strategies: [
                'Redundância de rede: Múltiplos caminhos de rede independentes, ISPs diversos, roteadores e switches redundantes',
                'Distribuição geográfica: Deployments multi-região, zonas de disponibilidade, localizações edge',
                'Qualidade de infraestrutura: Equipamentos de rede enterprise, planejamento adequado de capacidade, refresh regular de hardware',
                'Excelência operacional: Janelas de manutenção programadas, processos de gerenciamento de mudanças, monitoramento e alertas',
                'Chaos engineering: Testar regularmente cenários de partição para validar comportamento do sistema'
              ]
            },
            recovery: {
              title: 'Recuperação',
              description: 'Quando partições se curam, sistemas devem cuidadosamente reconciliar estado e resolver quaisquer conflitos que ocorreram durante a partição.',
              items: [
                'Failover automático',
                'Reconciliação de dados', 
                'Resolução de split-brain',
                'Degradação graceful'
              ],
              detailed_strategies: [
                'Detecção de conflitos: Identificar mudanças de estado divergentes que ocorreram durante a partição',
                'Estratégias de merge: Implementar lógica específica da aplicação para resolver conflitos automaticamente',
                'Intervenção manual: Fornecer ferramentas para operadores resolverem conflitos complexos manualmente',
                'Transações de compensação: Implementar operações de desfazer para mudanças de estado conflitantes',
                'Vetores de versão: Usar timestamps lógicos para estabelecer causalidade e ordem de resolução de conflitos'
              ]
            },
            design_principles: {
              title: 'Princípios de Design para Tolerância a Partições',
              architectural: {
                title: 'Padrões Arquiteturais',
                items: [
                  'Usar algoritmos de consenso (Raft, Paxos)',
                  'Implementar decisões baseadas em quorum',
                  'Projetar para consistência eventual',
                  'Usar circuit breakers e bulkheads'
                ],
                detailed_patterns: [
                  'Algoritmos de consenso: Raft, Paxos, PBFT para manter acordo através de partições',
                  'Sistemas de quorum: Tomada de decisão baseada em maioria para garantir consistência durante partições',
                  'Event sourcing: Logs de eventos imutáveis que podem ser mesclados quando partições se curam',
                  'CQRS: Separar modelos de leitura e escrita para lidar com cenários de partição diferentemente',
                  'Padrão Saga: Transações de longa duração com compensação para consistência distribuída'
                ]
              },
              operational: {
                title: 'Práticas Operacionais',
                items: [
                  'Testes regulares de recuperação de desastres',
                  'Sistemas de monitoramento e alertas',
                  'Implantação e escalonamento automatizados',
                  'Documentação e runbooks'
                ],
                detailed_practices: [
                  'Chaos engineering: Induzir partições regularmente para testar comportamento do sistema',
                  'Exercícios de game day: Praticar cenários de partição com equipes inteiras',
                  'Testes automatizados: Incluir testes de partição em pipelines CI/CD',
                  'Dashboards de monitoramento: Visibilidade em tempo real sobre detecção e recuperação de partições',
                  'Procedimentos de runbook: Guias passo-a-passo para lidar com cenários de partição'
                ]
              }
            },
            cap_theorem_connection: {
              title: 'Conexão com Teorema CAP',
              explanation: 'Partições de rede forçam trade-offs imediatos do teorema CAP entre consistência e disponibilidade',
              trade_offs: [
                'Escolher Consistência: Rejeitar operações para manter consistência de dados, sacrificando disponibilidade',
                'Escolher Disponibilidade: Continuar operações com dados potencialmente obsoletos, sacrificando consistência',
                'Abordagem híbrida: Diferentes serviços podem fazer diferentes trade-offs baseados em requisitos de negócio'
              ]
            },
            best_practices: {
              title: 'Melhores Práticas',
              practices: [
                'Projetar para tolerância a partições desde o início',
                'Implementar monitoramento e alertas abrangentes',
                'Testar cenários de partição regularmente através de chaos engineering',
                'Documentar processos de tomada de decisão para tratamento de partições',
                'Treinar equipes de operações em procedimentos de resposta a partições',
                'Usar algoritmos de consenso comprovados ao invés de construir soluções customizadas',
                'Implementar degradação graciosa ao invés de falha completa do serviço',
                'Monitorar métricas de negócio durante cenários de partição'
              ]
            },
            characteristics_label: 'Características:',
            examples_label: 'Exemplos:',
            causes_label: 'Causas Detalhadas:',
            strategies_label: 'Estratégias:',
            challenges_label: 'Desafios:',
            patterns_label: 'Padrões Detalhados:',
            practices_label: 'Práticas Detalhadas:'
          }
        },
       
        componentes: {
          name: 'Componentes Básicos',
          description: 'Blocos fundamentais de sistemas distribuídos',
          banco_dados: {
            name: 'Bancos de Dados',
            description: 'Armazenamento e gerenciamento de dados'
          },
          cache: {
            name: 'Cache',
            description: 'Armazenamento temporário para melhor performance',
            simulator: {
              name: 'Simulador',
              description: 'Experimente diferentes estratégias de cache'
            }
          },
          load_balancer: {
            name: 'Balanceador de Carga',
            description: 'Distribuição de tráfego entre servidores',
            simulator: {
              name: 'Simulador',
              description: 'Experimente diferentes algoritmos de balanceamento'
            }
          },
          message_queue: {
            name: 'Filas de Mensagens',
            description: 'Comunicação assíncrona entre serviços',
            simulator: {
              name: 'Simulador',
              description: 'Experimente o fluxo de mensagens'
            }
          },
          cdn: {
            name: 'CDN',
            description: 'Distribuição global de conteúdo',
            simulator: {
              name: 'Simulador',
              description: 'Veja como o CDN acelera entregas'
            }
          },
          api_gateway: {
            name: 'API Gateway',
            description: 'Ponto único de entrada para APIs',
            simulator: {
              name: 'Simulador',
              description: 'Experimente roteamento e proteção de APIs'
            }
          },
          firewall: {
            name: 'Firewall',
            description: 'Segurança e controle de tráfego',
            simulator: {
              name: 'Simulador',
              description: 'Experimente regras de firewall'
            }
          },
          polling_webhooks: {
            name: 'Polling vs Webhooks',
            description: 'Estratégias de comunicação em tempo real',
            teoria: {
              name: 'Teoria e Conceitos',
              description: 'Fundamentos e comparação detalhada'
            },
            simulator: {
              name: 'Simulador Interativo',
              description: 'Veja a diferença na prática'
            }
          },
          vector_database: {
            name: 'Banco de Dados Vetorial',
            description: 'Armazene embeddings e faça busca por similaridade'
          },
          model_gateway: {
            name: 'Gateway de Modelos',
            description: 'Infraestrutura que fica na frente dos seus LLMs'
          },
          kafka: {
            name: 'Kafka e Streaming',
            description: 'Logs de eventos particionados e reproduzíveis e consumer groups',
            simulator: {
              name: 'Simulador de Kafka',
              description: 'Ajuste partições e consumidores e veja o consumer lag'
            }
          },
          dns: {
            name: 'DNS',
            description: 'A lista telefônica distribuída que resolve nomes em endereços'
          },
          reverse_proxy: {
            name: 'Reverse Proxy',
            description: 'Uma porta de entrada que termina TLS, roteia e faz cache'
          },
          service_discovery: {
            name: 'Service Discovery',
            description: 'Como serviços se encontram numa frota dinâmica'
          },
          service_mesh: {
            name: 'Service Mesh',
            description: 'Proxies sidecar para tráfego, segurança e observabilidade'
          },
          kubernetes: {
            name: 'Kubernetes',
            description: 'Orquestração declarativa de containers em escala'
          }
        },
        principios_design: {
          name: 'Princípios de Design',
          description: 'Conceitos essenciais para sistemas robustos',
          escalabilidade: {
            name: 'Escalabilidade',
            description: 'Crescimento e adaptação do sistema',
            horizontal: {
              name: 'Horizontal (Scale Out)',
              description: 'Adicionando mais máquinas',
              simulator: {
                name: 'Simulador',
                description: 'Experimente escalabilidade horizontal'
              }
            },
            vertical: {
              name: 'Vertical (Scale Up)',
              description: 'Aumentando recursos da máquina',
              simulator: {
                name: 'Simulador',
                description: 'Experimente escalabilidade vertical'
              }
            },
            latencia: {
              name: 'Latência',
              description: 'Medindo e otimizando a latência'
            },
            failover: {
              name: 'Failover',
              description: 'Recuperação automática de falhas'
            },
            simulator: {
              name: 'Simulador Completo',
              description: 'Compare diferentes estratégias de escala'
            }
          },
          disponibilidade: {
            name: 'Alta Disponibilidade',
            description: 'Mantendo o sistema sempre funcionando',
            replicacao: {
              name: 'Replicação',
              description: 'Cópias sincronizadas dos dados'
            },
            failover: {
              name: 'Failover',
              description: 'Recuperação automática de falhas'
            },
            zonas: {
              name: 'Zonas de Disponibilidade',
              description: 'Distribuição geográfica para resiliência'
            },
            'disaster-recovery': {
              name: 'Recuperação de Desastres',
              description: 'Estratégias de recuperação de falhas catastróficas'
            },
            monitoramento: {
              name: 'Monitoramento de Saúde',
              description: 'Acompanhamento contínuo da saúde do sistema'
            },
            'distribuicao-carga': {
              name: 'Distribuição de Carga',
              description: 'Distribuição de tráfego entre servidores'
            },
            simulator: {
              name: 'Simulador',
              description: 'Experimente estratégias de disponibilidade'
            }
          },
          tolerancia_falhas: {
            name: 'Tolerância a Falhas',
            description: 'Lidando com falhas no sistema',
            retries: {
              name: 'Retries',
              description: 'Tentativas automáticas',
              simulator: {
                name: 'Simulador',
                description: 'Experimente diferentes estratégias de retry'
              }
            },
            circuit_breaker: {
              name: 'Circuit Breaker',
              description: 'Prevenindo falhas em cascata',
              simulator: {
                name: 'Simulador',
                description: 'Veja o circuit breaker em ação'
              }
            },
            timeout: {
              name: 'Timeout',
              description: 'Limitando tempo de espera',
              simulator: {
                name: 'Simulador',
                description: 'Experimente diferentes configurações de timeout'
              }
            }
          },
          eventos: {
            name: 'Arquitetura Orientada a Eventos',
            description: 'Sistemas baseados em eventos',
            simulator: {
              name: 'Simulador',
              description: 'Experimente event sourcing e event-driven'
            }
          },
          servicos: {
            name: 'Arquitetura de Serviços',
            description: 'Monolito vs Microsserviços'
          },
          acoplamento: {
            name: 'Acoplamento',
            description: 'Acoplamento dinâmico e estático entre serviços'
          },
          orquestracao_vs_coreografia: {
            name: 'Orquestração vs Coreografia',
            description: 'Compare os padrões de orquestração e coreografia'
          },
          cqrs: {
            name: 'CQRS',
            description: 'Separe os modelos de escrita e leitura via um log de eventos',
            simulator: {
              name: 'Simulador de CQRS',
              description: 'Emita comandos e veja os read models se atualizarem'
            }
          },
          rate_limiting: {
            name: 'Rate Limiting',
            description: 'Token bucket, leaky bucket e janela deslizante',
            simulator: {
              name: 'Simulador de Rate Limiter',
              description: 'Compare algoritmos e veja aceitas vs rejeitadas'
            }
          },
          backpressure: {
            name: 'Backpressure',
            description: 'Controle de fluxo quando consumidores não acompanham',
            simulator: {
              name: 'Simulador de Backpressure',
              description: 'Throttle o produtor quando a fila enche'
            }
          }
        },
        estrategias_de_consistencia: {
          name: 'Estratégias de Consistência',
          description: 'Como garantir a consistência em sistemas distribuídos',
          sincronizacao: {
            name: 'Sincronização',
            description: 'Coordenação e sincronização em sistemas distribuídos',
            fundamentos: {
              name: 'Fundamentos',
              description: 'Conceitos básicos de sincronização usando o Jantar dos Filósofos'
            },
            deadlocks: {
              name: 'Deadlocks',
              description: 'Prevenção e detecção de deadlocks no contexto dos Filósofos'
            },
            algoritmos: {
              name: 'Algoritmos',
              description: 'Algoritmos distribuídos para coordenação'
            }
          },
          two_phase_commit: {
            name: 'Two Phase Commit',
            description: 'Protocolo de consenso para transações distribuídas',
            simulador: {
              name: 'Simulador',
              description: 'Simulação interativa do protocolo Two Phase Commit'
            }
          },
          consenso: {
            name: 'Estratégia de Consenso',
            description: 'Protocolos e mecanismos para garantir acordo entre nós',
            simulador: {
              name: 'Simulador',
              description: 'Simulação interativa dos protocolos de consenso'
            }
          },
          lamport_timestamps: {
            name: 'Relógios Lógicos de Lamport',
            description: 'Ordenação de eventos em sistemas distribuídos',
            simulador: {
              name: 'Simulador',
              description: 'Visualize a ordenação de eventos com timestamps de Lamport'
            }
          },
          saga: {
            name: 'Padrão Saga',
            description: 'Transações longas com ações compensatórias',
            simulator: {
              name: 'Simulador de Saga',
              description: 'Rode uma saga, injete uma falha e veja o rollback'
            }
          },
          delivery_semantics: {
            name: 'Semânticas de Entrega',
            description: 'At-most-once, at-least-once e exactly-once',
            simulator: {
              name: 'Simulador de Semânticas de Entrega',
              description: 'Alterne dedup e DLQ para controlar duplicatas e perdas'
            }
          },
          vector_clocks: {
            name: 'Relógios Vetoriais',
            description: 'Rastreie causalidade e detecte atualizações concorrentes'
          }
        },
        monitoramento_e_manutencao: {
          name: 'Monitoramento e Manutenção',
          description: 'Monitoramento e manutenção de sistemas distribuídos',
          metricas: {
            name: 'Métricas e KPIs',
            description: 'Indicadores essenciais para monitoramento'
          },
          logs: {
            name: 'Logs e Tracing',
            description: 'Rastreamento e análise de logs distribuídos',
            simulador: {
              name: 'Simulador de Logs',
              description: 'Experimente com bons e maus exemplos de logs'
            },
            tracing: {
              name: 'Tracing Simulator',
              description: 'Experimente o rastreamento de eventos'
            }
          },
          alertas: {
            name: 'Alertas e Notificações',
            description: 'Configuração e gestão de alertas'
          },
          performance: {
            name: 'Análise de Performance',
            description: 'Identificação e resolução de gargalos'
          },
          health_checks: {
            name: 'Health Checks',
            description: 'Monitoramento de saúde dos serviços'
          },
          llm_observability: {
            name: 'Observabilidade de LLM',
            description: 'Tokens, custo, traces e avaliações de qualidade'
          },
          distributed_tracing: {
            name: 'Distributed Tracing',
            description: 'Acompanhe uma requisição entre serviços com spans e contexto'
          },
          slo_sli_sla: {
            name: 'SLO, SLI e Error Budgets',
            description: 'Meça a confiabilidade e gaste-a com burn rate'
          }
        },
        casos_reais: {
          name: 'Casos Reais',
          description: 'Exemplos reais de system design de grandes empresas',
          youtube: {
            name: 'YouTube',
            description: 'Como o YouTube processa e distribui vídeos globalmente'
          },
          spotify: {
            name: 'Spotify',
            description: 'Arquitetura de streaming de música em tempo real'
          },
          bitly: {
            name: 'Bit.ly',
            description: 'Design de um serviço de encurtamento de URLs em escala'
          },
          whatsapp: {
            name: 'WhatsApp',
            description: 'Sistema de mensagens em tempo real'
          },
          netflix: {
            name: 'Netflix',
            description: 'Streaming de vídeo e recomendação de conteúdo'
          },
          uber: {
            name: 'Uber',
            description: 'Sistema de geolocalização e matching em tempo real'
          },
          chatgpt: {
            name: 'ChatGPT',
            description: 'Servindo LLMs a centenas de milhões com streaming'
          },
          perplexity: {
            name: 'Perplexity',
            description: 'Motor de respostas baseado em RAG com fontes citadas'
          },
          github_copilot: {
            name: 'GitHub Copilot',
            description: 'Autocompletar de código inline de baixa latência em escala'
          }
        },
        seguranca: {
          name: 'Segurança',
          description: 'Proteção e segurança em sistemas distribuídos',
          autenticacao: {
            name: 'Autenticação',
            description: 'Verificação de identidade em sistemas distribuídos'
          },
          autorizacao: {
            name: 'Autorização',
            description: 'Controle de acesso e permissões'
          },
          criptografia: {
            name: 'Criptografia',
            description: 'Proteção de dados em trânsito e em repouso',
            simulador: {
              name: 'Simulador',
              description: 'Experimente diferentes tipos de criptografia na prática'
            }
          },
          tokens: {
            name: 'Tokens e JWT',
            description: 'Gerenciamento de sessões e tokens de acesso',
            simulador: {
              name: 'Simulador',
              description: 'Experimente a geração e validação de JWTs'
            }
          },
          ssl_tls: {
            name: 'SSL/TLS',
            description: 'Comunicação segura entre sistemas'
          },
          ataques: {
            name: 'Ataques Comuns',
            description: 'Prevenção contra ataques em sistemas distribuídos'
          },
          prompt_injection: {
            name: 'Prompt Injection',
            description: 'Ataques específicos de LLM e guardrails',
            simulador: {
              name: 'Simulador de Prompt Injection',
              description: 'Combine defesas e veja se o segredo vaza'
            }
          }
        },
        ai_systems: {
          name: 'Sistemas de IA e LLMs',
          description: 'Servir LLMs, RAG, busca vetorial e agentes em escala',
          llm_serving_fundamentals: {
            name: 'Fundamentos de Serving de LLM',
            description: 'Tokens, janelas de contexto, prefill vs decode e o KV cache',
            simulator: {
              name: 'Simulador de Batching de Inferência',
              description: 'Veja como o batching equilibra vazão e latência'
            }
          },
          rag: {
            name: 'Arquitetura RAG',
            description: 'Fundamente respostas nos seus próprios dados com recuperação',
            simulator: {
              name: 'Simulador de Pipeline RAG',
              description: 'Ajuste fragmentação, recuperação e reordenação de ponta a ponta'
            }
          },
          vector_search: {
            name: 'Busca Vetorial',
            description: 'Busca de vizinhos mais próximos aproximados em escala',
            simulator: {
              name: 'Simulador de Busca Vetorial',
              description: 'Equilibre recall e latência com parâmetros do HNSW'
            }
          },
          llm_gateway: {
            name: 'Gateway de LLM',
            description: 'Roteamento, cache semântico, fallback e controle de custo',
            simulator: {
              name: 'Simulador de Gateway de LLM',
              description: 'Roteie requisições com cache, fallback e limites de taxa'
            }
          },
          gpu_autoscaling: {
            name: 'Serving de GPU e Autoescalonamento',
            description: 'Partidas a frio, filas e escala-a-zero para GPUs',
            simulator: {
              name: 'Simulador de Autoescalonador de GPU',
              description: 'Equilibre custo e latência sob carga em rajadas'
            }
          },
          agentic: {
            name: 'Sistemas com Agentes',
            description: 'Chamada de ferramentas e orquestração de múltiplos passos',
            simulator: {
              name: 'Simulador de Orquestração de Agentes',
              description: 'Veja um agente chamar ferramentas, repetir e ramificar'
            }
          }
        },
        data_storage: {
          name: 'Dados e Armazenamento',
          description: 'Particionamento, replicação e como achar dados em escala',
          consistent_hashing: {
            name: 'Consistent Hashing',
            description: 'Coloque chaves num anel para mover poucas a cada mudança',
            simulator: {
              name: 'Simulador de Consistent Hashing',
              description: 'Adicione e remova nós e veja as chaves serem remapeadas'
            }
          },
          sharding: {
            name: 'Sharding e Particionamento',
            description: 'Divida dados por faixa, hash ou diretório — e evite gargalos',
            simulator: {
              name: 'Simulador de Sharding',
              description: 'Envie chaves para shards e veja shards quentes surgirem'
            }
          },
          object_storage: {
            name: 'Object & Blob Storage',
            description: 'Armazenamento de blobs durável e barato em escala massiva (S3)'
          },
          distributed_file_systems: {
            name: 'Sistemas de Arquivos Distribuídos',
            description: 'GFS/HDFS: arquivos em blocos e replicados por um cluster'
          },
          inverted_index: {
            name: 'Busca e Índice Invertido',
            description: 'A estrutura de dados por trás da busca textual',
            simulator: {
              name: 'Simulador de Índice Invertido',
              description: 'Consulte termos e veja documentos ranqueados por pontuação'
            }
          }
        },
        editor: {
          name: 'Editor de Sistemas',
          description: 'Crie e simule sistemas distribuídos'
        },
        forum: {
          name: 'Fórum da Comunidade',
          description: 'Discuta e aprenda com a comunidade'
        },
        design_lab: {
          name: 'Design Lab',
          description: 'Acesse nosso design lab'
        }
      },
      skills: {
        consensus: 'Consenso',
        lamport_timestamps: 'Timestamps de Lamport',
        eventual_consistency: 'Consistência eventual',
        synchronization: 'Sincronização',
        mutual_exclusion: 'Exclusão Mútua',
        deadlock_prevention: 'Deadlock Prevention',
        distributed_synchronization: 'Sincronização Distribuída',
        race_conditions: 'Condições de Corrida',
        shared_resources: 'Recursos Compartilhados',
        deadlock_detection: 'Detecção de Deadlock',
        prevention: 'Prevenção',
        recovery: 'Recuperação',
        bakery_algorithm: 'Algoritmo do Padeiro',
        token_ring: 'Token Ring',
        ricart_agrawala: 'Ricart-Agrawala',
        two_phase_commit: '2PC',
        distributed_transactions: 'Transações Distribuídas',
        atomic_consensus: 'Consenso Atômico',
        visualization: 'Visualização',
        experimentation: 'Experimentação',
        solution_analysis: 'Análise de Soluções'
      },
      prerequisites: {
        design_principles: 'Princípios de Design'
      },
      categories: {
        basic: 'Básico',
        intermediate: 'Intermediário',
        advanced: 'Avançado'
      },
      roadmap: {
        title: 'Roadmap de Aprendizado',
        description_1: 'Siga este guia estruturado para dominar os conceitos de sistemas distribuídos.',
        description_2: 'O roadmap está organizado em uma sequência lógica de aprendizado, com pré-requisitos claros e habilidades a serem desenvolvidas em cada etapa.',
        free: 'Grátis',
        premium: 'Premium',
        in_dev: 'Em desenvolvimento',
        modules: 'módulos',
        completed: 'Concluído',
        in_progress: 'Em andamento',
        not_started: 'Não iniciado',
        start_module: 'Começar módulo',
        resume_module: 'Continuar módulo',
        review_module: 'Revisar módulo',
        prerequisites: 'Pré-requisitos:',
        skills: 'Habilidades:',
        completed_percent: '{{percent}}% do conteúdo completado',
        ops_map: 'MAPA OPS',
        phase: 'Fase',
        lessons: 'lições',
        modules_cleared: 'Módulos concluídos',
        lessons_done: 'Lições concluídas',
        readiness: 'Prontidão',
        total_phases: 'Fases',
        of_count: 'de {{count}}'
      },
      theoretical_foundations_main: {
        subtitle: 'Construindo conhecimento inabalável em sistemas distribuídos',
        hero: {
            title: 'Por que a Teoria Importa na Prática',
            description: 'No mundo acelerado de hoje, pode parecer tentador pular direto para a implementação. No entanto, sem fundamentos teóricos sólidos, até mesmo os engenheiros mais experientes podem cometer erros custosos que poderiam ter sido evitados com o entendimento adequado dos princípios fundamentais.'
          },
          paragraph1: 'Compreender os fundamentos teóricos em sistemas distribuídos não é um luxo acadêmico—é uma necessidade prática. Assim como um arranha-céu requer uma base sólida para resistir a terremotos e tempestades, sistemas distribuídos requerem entendimento teórico para lidar com os desafios inevitáveis de falhas de rede, inconsistências de dados e pressões de escalabilidade. Engenheiros que dominam esses conceitos não apenas constroem sistemas; eles constroem sistemas que duram, escalam e se adaptam a requisitos em mudança.',
          paragraph2: 'Considere as consequências de construir sem teoria: equipes que implementam cache sem entender modelos de consistência frequentemente criam sistemas onde usuários veem suas próprias atualizações desaparecerem intermitentemente. Desenvolvedores que não compreendem o teorema CAP podem arquitetar sistemas que prometem tanto consistência perfeita quanto 100% de disponibilidade, apenas para descobrir durante momentos críticos que tais garantias são matematicamente impossíveis na presença de partições de rede.',
          paragraph3: 'O teorema CAP, um dos nossos tópicos fundamentais, fornece um framework crucial de tomada de decisão para arquitetos de sistema. Não se trata apenas de saber que você não pode ter consistência, disponibilidade e tolerância a partições simultaneamente—trata-se de entender o que isso significa para seu caso de uso específico. Sua plataforma de e-commerce deve priorizar mostrar preços consistentes (consistência) ou garantir que o site permaneça online durante problemas de rede (disponibilidade)? A resposta depende dos requisitos de negócio, mas o framework para tomar essa decisão vem do entendimento das implicações teóricas.',
          paragraph4: 'Modelos de consistência formam outro pilar do conhecimento teórico que impacta diretamente a implementação prática. Quando a Netflix decide usar consistência eventual para atualizações de recomendações de usuário, mas consistência forte para informações de cobrança, eles estão aplicando conhecimento teórico para resolver problemas reais de negócio. Entender quando aplicar consistência forte, eventual ou fraca não é intuitivo—requer compreender os trade-offs entre performance, disponibilidade e precisão de dados.',
          paragraph5: 'O entendimento teórico de trade-offs se estende muito além do interesse acadêmico—traduz-se diretamente em valor de negócio. Engenheiros que entendem esses conceitos podem tomar decisões informadas sobre escolhas de tecnologia, evitando reescritas custosas e problemas de performance. Eles podem estimar o custo real das garantias de consistência, prever como sistemas se comportarão sob carga e projetar arquiteturas que lidam graciosamente com cenários de falha.',
          paragraph6: 'Fundamentos teóricos também servem como escudo contra armadilhas comuns que afligem sistemas distribuídos. As "8 Falácias da Computação Distribuída" não são apenas curiosidades históricas—são avisos práticos sobre suposições que continuam a derrubar equipes de desenvolvimento modernas. Entender que "a rede é confiável" é falso ajuda engenheiros a projetar sistemas com mecanismos de retry adequados, circuit breakers e estratégias de degradação graciosa.',
          paragraph7: 'De uma perspectiva de colaboração, conhecimento teórico fornece uma linguagem comum para discussões técnicas. Quando arquitetos discutem se devem implementar réplicas de leitura, conversas se tornam mais produtivas quando todos entendem conceitos como consistência de leitura, tolerância a lag e cenários de split-brain. A teoria fornece o vocabulário para comunicação técnica precisa, reduzindo mal-entendidos que levam a desalinhamentos arquiteturais.',
          paragraph8: 'Esses fundamentos também fornecem uma abordagem sistemática para resolução de problemas. Quando um sistema de produção exibe comportamento estranho—usuários em diferentes regiões vendo dados diferentes, ou performance degradando sob condições específicas—engenheiros com base teórica podem rapidamente estreitar as causas raiz. Eles entendem a relação entre topologia de rede, garantias de consistência e características de performance, permitindo diagnóstico e resolução mais rápidos.',
          paragraph9: 'Conforme a tecnologia evolui, fundamentos teóricos permanecem constantes enquanto implementações mudam. Os princípios por trás de algoritmos de consenso se aplicam seja você usando Raft no etcd, Paxos no Spanner, ou tolerância a falhas bizantinas em sistemas blockchain. Engenheiros que entendem a teoria podem se adaptar a novas tecnologias mais rapidamente porque reconhecem padrões familiares e podem prever como novos sistemas se comportarão.',
          paragraph10: 'Em termos de carreira, engenheiros com fundamentos teóricos fortes se tornam multiplicadores de força em suas organizações. Eles podem mentorar desenvolvedores júnior, participar significativamente de decisões arquiteturais e evitar a armadilha da "programação cargo cult" onde soluções são copiadas sem entendimento. Eles se tornam os engenheiros para quem as empresas se voltam para problemas complexos e decisões de design de sistema.',
          paragraph11: 'Além disso, conhecimento teórico possibilita inovação e contribuição para o campo. Entender algoritmos existentes e suas limitações é o primeiro passo para desenvolver melhorias ou abordagens inteiramente novas. Muitas das inovações mais bem-sucedidas em sistemas distribuídos hoje vieram de engenheiros que entendiam profundamente a teoria existente e identificaram oportunidades de avanço.',
          conclusion: 'Em conclusão, fundamentos teóricos em sistemas distribuídos não são apenas pré-requisitos acadêmicos—são ferramentas práticas que possibilitam melhor tomada de decisão, comunicação mais efetiva e design de sistema mais robusto. Eles fornecem o framework intelectual para entender por que certas abordagens funcionam, quando podem falhar e como adaptá-las a requisitos específicos. Para qualquer engenheiro sério sobre construir sistemas distribuídos confiáveis e escaláveis, investir tempo nesses fundamentos teóricos paga dividendos ao longo de toda sua carreira.',
          explore_topics: 'Explore Tópicos Fundamentais'
      },
      editor: {
        title: 'Simulador de Sistema Distribuído',
        buttons: {
          start: 'Executar',
          stop: 'Pausar',
          step: 'Passo',
          reset: 'Reiniciar',
          export: 'Exportar (.din)',
          import: 'Importar (.din)',
          remove_edge: 'Remover Conexão'
        },
        kinds: {
          client: 'Cliente',
          loadBalancer: 'Balanceador',
          apiGateway: 'API Gateway',
          cache: 'Cache',
          server: 'Servidor',
          database: 'Banco de Dados',
          replicatedDb: 'BD Replicado',
          shardRouter: 'Roteador de Shards',
          messageQueue: 'Fila de Mensagens',
          circuitBreaker: 'Circuit Breaker',
          autoScaler: 'Auto-Scaler',
          externalDependency: 'Dependência Externa'
        },
        engine_tagline: 'MOTOR DE SIMULAÇÃO V2',
        how_to_use: 'Como usar',
        menu: {
          edit: 'Editar configurações',
          duplicate: 'Duplicar',
          disconnect: 'Desconectar arestas',
          kill: 'Matar nó (caos)',
          delete: 'Excluir',
          delete_edge: 'Excluir conexão'
        },
        descriptions: {
          client: 'Gera a carga ofertada (requisições/s) que move todo o sistema. Conecte a saída dele à primeira camada (API gateway, balanceador ou servidor). Ajuste a "Taxa base" para definir quantas requisições por segundo entram no sistema.',
          loadBalancer: 'Distribui as requisições recebidas entre as réplicas para as quais aponta, usando a estratégia escolhida (round-robin, menos conexões, ponderado ou hashing consistente). Coloque-o entre o cliente/gateway e um conjunto de servidores.',
          apiGateway: 'Ponto único de entrada na borda do sistema. Impõe um limite de requisições/s — o tráfego acima do limite é descartado — e encaminha o restante aos backends. Conecte o cliente a ele e ele aos seus serviços.',
          cache: 'Atende uma fração das leituras a partir da memória, definida pela "Taxa de acerto". Acertos retornam rápido; erros caem para o armazenamento abaixo. Coloque-o à frente de um banco ou serviço para reduzir carga e latência.',
          server: 'Camada de computação sem estado que processa requisições com um tempo de serviço e concorrência. Escale-o com réplicas ou coloque um auto-scaler à frente. Conecte-o a bancos, caches ou outros serviços dos quais depende.',
          database: 'Armazenamento persistente e um ponto final (sem arestas de saída). Seu tempo de serviço e concorrência o tornam um gargalo comum. Envie tráfego de leitura/escrita dos servidores para ele.',
          replicatedDb: 'Banco de dados com várias réplicas. Escritas (definidas pela "Fração de escrita") vão ao primário; leituras se distribuem entre as réplicas. Escolha o nível de consistência (forte/quórum/eventual) e o atraso de replicação para modelar trade-offs.',
          shardRouter: 'Particiona o tráfego entre shards por chave usando estratégia de hash ou intervalo. O "Desbalanceamento de shard" modela um shard recebendo carga desproporcional. Conecte-o a um conjunto de backends de shard.',
          messageQueue: 'Armazena as requisições recebidas e as drena a uma taxa fixa para suavizar picos. Mensagens acima da capacidade da fila são descartadas. Coloque-a entre um produtor rápido e um consumidor mais lento.',
          circuitBreaker: 'Envolve uma dependência abaixo. Quando a taxa de erro excede o limiar, ele abre e descarta carga durante o timeout de reset, depois entra em meio-aberto para testar a recuperação. Use-o para evitar falhas em cascata.',
          autoScaler: 'Ajusta o número de réplicas da camada à sua frente para manter a utilização próxima do alvo, limitado por mín/máx de réplicas. Use-o para reagir automaticamente a mudanças de carga.',
          externalDependency: 'Um serviço de terceiros que você não controla (um ponto final). Modele sua latência e taxa de falha para simular indisponibilidades ou lentidão de provedores externos.'
        },
        hints: {
          label: 'Nome exibido para este nó no canvas. Não afeta a simulação.',
          base_rate: 'Requisições por segundo que este cliente gera. Maior = mais carga em todo o sistema; menor = tráfego mais leve.',
          service_time: 'Milissegundos para processar uma requisição (define a taxa de serviço µ). Maior = mais lento por requisição, menor capacidade e maior latência; menor = mais rápido e mais vazão.',
          concurrency: 'Workers paralelos por réplica (o c do M/M/c). Maior = mais requisições atendidas ao mesmo tempo, menos fila e menor latência; menor = satura mais cedo.',
          replicas: 'Número de cópias idênticas deste nó (escala horizontal). Maior = capacidade proporcionalmente maior; menor = menos capacidade.',
          failure_rate: 'Probabilidade base de uma requisição falhar aqui, independente da carga. Maior = mais erros propagados; menor = mais confiável.',
          timeout: 'Milissegundos até uma requisição lenta ser contada como falha. Menor = mais timeouts quando o nó está ocupado; maior = espera mais antes de desistir.',
          max_retries: 'Quantas vezes uma chamada que falhou é repetida. Maior = menos erros finais mas mais carga amplificada (tempestade de retries); menor = menos carga mas mais falhas visíveis.',
          distribution: 'Formato da distribuição de latência por requisição. Lognormal tem cauda pesada realista, exponencial é sem memória, determinística é constante.',
          variability: 'Coeficiente de variação da latência (apenas lognormal). Maior = cauda mais pesada, então p95/p99 crescem; menor = latências mais uniformes.',
          strategy: 'Como as requisições são distribuídas entre as réplicas (round-robin, menos conexões, ponderado ou hashing consistente).',
          rate_limit: 'Máximo de requisições por segundo admitidas; o excedente é descartado. Maior = menos descartes mas mais carga abaixo; menor = protege os backends mas rejeita tráfego.',
          hit_rate: 'Fração de leituras atendidas pelo cache. Maior = muito menos carga e latência abaixo; menor = mais requisições caem para o armazenamento.',
          ttl: 'Quanto tempo as entradas do cache permanecem válidas. Maior = mais acertos mas dados mais antigos; menor = dados mais frescos mas mais erros de cache.',
          queue_capacity: 'Máximo de mensagens em buffer. Maior = absorve picos maiores sem descartar, mas adiciona latência de backlog; menor = descarta mais cedo sob sobrecarga.',
          drain_rate: 'Mensagens consumidas por segundo. Maior = o backlog esvazia mais rápido e a latência cai; menor = o backlog se acumula.',
          write_fraction: 'Fração de operações que são escritas. Maior = mais carga no primário único (escritas serializam), reduzindo a capacidade efetiva; menor = leituras dominam e escalam pelas réplicas.',
          replication_lag: 'Milissegundos que as réplicas atrasam em relação ao primário. Maior = leituras mais desatualizadas com consistência eventual; menor = réplicas mais frescas.',
          consistency: 'Garantia de leitura/escrita. Forte é mais segura mas mais lenta, quórum equilibra, eventual é mais rápida mas pode ler dados antigos.',
          shard_count: 'Número de partições entre as quais o tráfego é dividido. Maior = mais capacidade paralela; menor = cada shard carrega mais carga.',
          skew: 'Quão desigual a carga cai no shard mais quente. Maior = um shard satura e limita a capacidade efetiva; menor = carga equilibrada.',
          shard_strategy: 'Como as chaves mapeiam para shards. Hash distribui uniformemente; intervalo mantém chaves vizinhas juntas (mais propenso a hotspots).',
          error_threshold: 'Taxa de erro abaixo que abre o breaker. Menor = abre mais cedo para proteger a dependência; maior = tolera mais erros antes.',
          reset_timeout: 'Milissegundos que o breaker fica aberto antes de testar a recuperação. Maior = espera mais antes de tentar de novo; menor = tenta a dependência mais cedo.',
          target_utilization: 'Utilização que o auto-scaler tenta manter. Menor = escala antes (mais réplicas, mais folga); maior = opera mais quente com menos réplicas.',
          min_replicas: 'Limite inferior de réplicas que o auto-scaler mantém, mesmo ocioso.',
          max_replicas: 'Limite superior de réplicas que o auto-scaler pode adicionar sob carga.'
        },
        inspector: {
          title: 'Inspetor',
          empty: 'Selecione um nó para editar sua configuração.',
          label: 'Rótulo',
          base_rate: 'Taxa base',
          service_time: 'Tempo de serviço',
          concurrency: 'Concorrência (c)',
          replicas: 'Réplicas',
          capacity_approx: 'capacidade ≈ {{value}}',
          reliability: 'Confiabilidade',
          failure_rate: 'Taxa de falha',
          timeout: 'Timeout',
          max_retries: 'Máx. tentativas',
          latency_shape: 'Distribuição de latência',
          distribution: 'Distribuição',
          variability: 'Variabilidade (CV)',
          strategy: 'Estratégia',
          rate_limit: 'Limite de taxa',
          hit_rate: 'Taxa de acerto',
          ttl: 'TTL',
          queue_capacity: 'Capacidade da fila',
          drain_rate: 'Taxa de drenagem',
          write_fraction: 'Fração de escrita',
          replication_lag: 'Atraso de replicação',
          consistency: 'Consistência',
          shard_count: 'Número de shards',
          skew: 'Desbalanceamento de shard',
          error_threshold: 'Limiar de erro',
          reset_timeout: 'Timeout de reset',
          target_utilization: 'Utilização alvo',
          min_replicas: 'Mín. réplicas',
          max_replicas: 'Máx. réplicas',
          dist: { lognormal: 'Lognormal', exponential: 'Exponencial', deterministic: 'Determinística' },
          strat: { roundRobin: 'Round Robin', leastConnections: 'Menos Conexões', weighted: 'Ponderado', hashing: 'Hashing Consistente' },
          cons: { strong: 'Forte', quorum: 'Quórum', eventual: 'Eventual' },
          shard_strat: { hash: 'Hash', range: 'Intervalo' }
        },
        dashboard: {
          offered: 'Ofertado',
          throughput: 'Vazão',
          success: 'Sucesso',
          p95: 'p95',
          in_flight: 'Em andamento',
          cost: 'Custo {{provider}}',
          error_budget: 'Orçamento de erro usado (SLO {{slo}}%)',
          chart_throughput: 'Vazão vs Ofertado (req/s)',
          chart_latency: 'Percentis de latência (ms)',
          chart_success: 'Taxa de sucesso (%) e em andamento',
          accumulated_cost: 'Custo acumulado nesta execução:'
        },
        scenario: {
          preset: 'Predefinição',
          load_profile: 'Perfil de carga',
          cloud: 'Cloud',
          chaos: 'Caos',
          load: 'Carregar',
          inject: 'Injetar',
          profiles: { constant: 'Constante', ramp: 'Rampa', spike: 'Pico', diurnal: 'Diurno', step: 'Degrau' },
          chaos_types: { killNode: 'Matar nó', latencyInjection: 'Injetar latência', partition: 'Partição' },
          presets: {
            'three-tier': 'App Web de Três Camadas',
            'read-heavy-cache': 'Leitura Intensa + Cache',
            'event-driven': 'Orientado a Eventos + Fila',
            'sharded-store': 'Armazenamento Particionado',
            'microservice-mesh': 'Malha de Microsserviços'
          }
        },
        node: {
          in: 'ent',
          out: 'saí',
          p95: 'p95',
          fail_s: 'falha/s',
          retry_s: 'retry/s',
          idle: 'ocioso',
          hit_s: 'acerto/s',
          miss_s: 'erro/s',
          hit_rate: 'taxa acerto',
          queue: 'fila',
          dropped_s: 'descart./s',
          breaker: 'breaker',
          replicas: 'réplicas',
          shards: 'shards',
          consistency: 'consistência',
          writes: 'escritas',
          reads: 'leituras',
          replica_set: 'conjunto de réplicas',
          primary: 'primária',
          replica: 'réplica'
        },
        warnings: {
          NO_CLIENT: 'Nenhum nó cliente no design',
          NOT_CONVERGED: 'A simulação não convergiu',
          BOTTLENECK: 'Gargalo: {{name}}',
          DISCONNECTED: 'Desconectado: {{name}}',
          ZERO_CAPACITY: 'Capacidade zero: {{name}}'
        },
        labels: {
          client_rps: 'Requisições/s do Cliente:',
          load_status: 'Status da Carga:',
          normal: 'Normal (<60%)',
          warning: 'Alerta (60-80%)',
          critical: 'Crítico (>80%)',
          components: 'Componentes',
          cloud: 'Cloud:',
          speed: 'Velocidade',
          seed: 'Semente',
          monthly_cost_estimate: 'Estimativa de Custo Mensal ({{provider}})',
          note_prefix: '* Estimativa baseada em preços públicos de {{provider}} (2024), simplificada para simulação.',
          total: 'Total'
        },
        metrics: {
          requests_per_second: 'Requisições/s',
          error_rate: 'Taxa de Erro',
          response_time_ms: 'Resposta',
          active_connections: 'Conexões Ativas',
          connections_limit: 'Limite de Conexões:',
          connections: 'conexões',
          algorithm: 'Algoritmo:',
          random: 'Aleatório',
          least_connections: 'Menor Número de Conexões',
          processing_time_ms: 'Tempo de Processamento (ms):',
          queue: 'Fila',
          enqueued_per_s: 'Enfileiradas/s',
          dequeued_per_s: 'Desenfileiradas/s',
          dropped_per_s: 'Descartadas/s',
          latency_ms: 'Latência',
          hit_rate: 'Hit Rate',
          hits_per_s: 'Hits/s',
          misses_per_s: 'Misses/s',
          failures_per_s: 'Falhas/s',
          queue_capacity: 'Capacidade da Fila:',
          dequeue_msgs_per_s: 'Desenfileirar (msgs/s):',
          throughput_reqs: 'Throughput (req/s):',
          failure_rate_percent: 'Taxa de Falha (%):',
          rate_limit_reqs: 'Rate Limit (req/s):',
          total_latency_ms: 'Latência total',
          throttled_per_s: 'Throttled/s:'
        },
        components: {
          client: 'Cliente',
          server: 'Servidor',
          database: 'Banco de Dados',
          load_balancer: 'Balanceador',
          api_gateway: 'API Gateway',
          cache: 'Cache',
          message_queue: 'Message Queue'
        },
        node_labels: {
          client: 'Cliente',
          server: 'Servidor',
          database: 'Banco de Dados',
          load_balancer: 'Balanceador',
          api_gateway: 'API Gateway',
          cache: 'Cache',
          message_queue: 'Message Queue'
        },
        cache_metrics: {
          requests_per_second: 'Requisições/s',
          response_time: 'Resposta',
          total_latency: 'Latência total',
          hits_per_second: 'Hits/s',
          misses_per_second: 'Misses/s',
          hit_rate: 'Hit Rate',
          failures_per_second: 'Falhas/s'
        },
        queue_metrics: {
          queue: 'Fila',
          enqueued_per_second: 'Enfileiradas/s',
          dequeued_per_second: 'Desenfileiradas/s',
          dropped_per_second: 'Descartadas/s',
          latency: 'Latência'
        },
        errors: {
          invalid_file: 'Arquivo inválido ou corrompido',
          import_error: 'Erro ao importar arquivo. Formato inválido ou corrompido.',
          read_error: 'Erro ao ler o arquivo. Tente novamente.'
        },
        dev_page: {
          title: 'Página em Desenvolvimento',
          description: 'Esta é uma prévia do Editor de Sistemas que está em desenvolvimento. Em breve, você poderá criar e simular arquiteturas distribuídas completas, com mais componentes, métricas e funcionalidades. Fique ligado nas próximas atualizações!',
          note: 'Nota: Os cálculos e métricas apresentados nesta versão são aproximados e podem não refletir com precisão o comportamento de um sistema real. Estamos trabalhando para melhorar a precisão das simulações.'
        }
      },
      forum: {
        title: 'Fórum da Comunidade',
        subtitle: 'Discuta, tire dúvidas e aprenda com a comunidade',
        new_topic: 'Novo Tópico',
        category: 'Categoria',
        title_field: 'Título',
        title_placeholder: 'O que você quer discutir?',
        content: 'Conteúdo',
        content_placeholder: 'Descreva sua dúvida ou tópico em detalhes...',
        markdown_supported: 'Markdown é suportado',
        cancel: 'Cancelar',
        post: 'Publicar',
        posting: 'Publicando...',
        by: 'por',
        all: 'Todos',
        replies: 'Respostas',
        reply: 'Responder',
        comments_count: '{{count}} comentários',
        comments_count_one: '{{count}} comentário',
        no_comments: 'Sem comentários',
        reply_placeholder: 'Escreva sua resposta...',
        nested_reply_placeholder: 'Escreva sua resposta a esta mensagem...',
        replying_to: 'Respondendo a:',
        delete: 'Excluir',
        delete_topic: 'Excluir tópico',
        confirm_delete_message: 'Tem certeza que deseja excluir esta mensagem?',
        confirm_delete_topic: 'Tem certeza que deseja excluir este tópico? Esta ação não pode ser desfeita.',
        back_to_topics: 'Voltar para os tópicos',
        no_topics: 'Nenhum tópico ainda',
        be_first: 'Seja o primeiro a iniciar uma discussão!',
        no_replies: 'Nenhuma resposta ainda. Seja o primeiro a responder!',
        try_again: 'Tentar novamente',
        subscription_required: 'Assinatura Necessária',
        subscription_message: 'O fórum da comunidade está disponível exclusivamente para assinantes. Assine agora para participar das discussões e aprender com a comunidade!',
        subscribe_now: 'Assinar Agora',
        login_required: 'Login Necessário',
        login_message: 'Por favor, faça login para acessar o fórum da comunidade.',
        subscribe_to_post: 'Assine para publicar',
        subscribe_to_reply: 'Assine para participar da discussão e responder aos tópicos.',
        sort: {
          recent: 'Mais recentes',
          active: 'Mais ativos',
          popular: 'Mais populares',
          oldest: 'Mais antigos',
          newest: 'Mais novos',
          top: 'Mais votados'
        },
        time: {
          just_now: 'agora',
          minutes_ago: 'há {{count}}m',
          hours_ago: 'há {{count}}h',
          days_ago: 'há {{count}}d'
        }
      },
      challenges: {
        title: 'Desafios de System Design',
        subtitle: 'Pratique suas habilidades com problemas reais de sistemas distribuídos',
        view_all: 'Ver Todos',
        start_challenge: 'Iniciar Desafio',
        attempt: 'tentativa',
        attempts: 'tentativas',
        has_video: 'Tem vídeo de solução',
        cta_title: 'Pronto para testar seus conhecimentos?',
        cta_description: 'Acesse o Design Lab para praticar system design com feedback de IA.',
        go_to_lab: 'Ir para o Design Lab'
      },
      components: {
        overview_title: 'Componentes Básicos',
        overview_subtitle: 'Explore os blocos fundamentais que compõem sistemas distribuídos',
        banner_text: 'Cada componente tem um papel específico na construção de sistemas distribuídos. Entenda suas características, vantagens e desafios.',
        common: {
          example: 'Exemplo:',
          simulator_title: 'Simulador Interativo',
          access_simulator: 'Acessar Simulador'
        },
        api_gateway: {
          title: 'API Gateway',
          lead1: 'Imagine um restaurante lotado. Você, o cliente, coloca seu pedido com o garçom (API Gateway). Ele garante que tudo funcione perfeitamente para você, mesmo se a cozinha for complexa e tiver vários cozinheiros especializados.',
          lead2: 'O API Gateway atua como intermediário inteligente entre clientes e serviços de backend, simplificando o acesso, aumentando a segurança e melhorando o desempenho geral do sistema.',
          functions_title: 'Funções do API Gateway',
          auth_title: 'Autenticação e Autorização',
          auth_p: 'Como a segurança na porta do restaurante, ele verifica sua identidade e se você tem permissão para entrar. O API Gateway verifica se o usuário está logado e tem permissão para acessar o recurso solicitado.',
          auth_example: 'Para acessar sua conta bancária online, você insere seu nome de usuário e senha. O API Gateway garante que apenas você, com as credenciais corretas, possa acessar suas informações.',
          routing_title: 'Roteamento',
          routing_p: 'É o garçom que sabe exatamente qual cozinheiro (microserviço) enviar cada pedido. O API Gateway direciona as solicitações para o serviço correto.',
          routing_example: 'Em um aplicativo de comércio eletrônico, um pedido de produto pode ser roteado para o serviço de inventário, enquanto o pagamento é roteado para o processamento de pagamento.',
          ratelimit_title: 'Limite de Taxa',
          ratelimit_p: 'É como limitar o número de clientes por hora para evitar sobrecarga. O API Gateway limita quantas solicitações um cliente pode fazer para proteger os serviços de backend.',
          ratelimit_example: 'Um serviço de API de clima pode limitar o número de solicitações por usuário para evitar abuso e garantir disponibilidade para todos.',
          aggregation_title: 'Agregação de Respostas',
          aggregation_p: 'É o garçom que organiza todos os pratos de seu pedido em uma única bandeja. O API Gateway combina respostas de vários serviços em uma única resposta para o cliente.',
          aggregation_example: 'Em um aplicativo de viagem, o API Gateway pode agregar informações de voos, hotéis e alugueis de carros de diferentes provedores em uma única resposta.',
          micro_title: 'Exemplo de Arquiteturas Baseadas em Microserviços',
          micro_intro: 'Em uma arquitetura de microserviços, o API Gateway atua como ponto central para clientes interagirem com microserviços. Ele encaminha solicitações para os serviços corretos e gerencia a comunicação entre o cliente e os componentes do sistema.',
          micro_example: 'Em um aplicativo de comércio eletrônico baseado em microserviços, o API Gateway lida com solicitações de produtos, carrinhos e transações, redirecionando para os serviços de backend relevantes (produto, inventário, pagamento).'
        },
        database: {
          title: 'Bancos de Dados',
          intro: 'Os bancos de dados são um dos componentes mais importantes de qualquer sistema, responsáveis pelo armazenamento, consulta e gerenciamento de grandes volumes de dados.',
          relational_title: 'Bancos de Dados Relacionais (SQL)',
          relational_p1: 'Armazenam dados em tabelas com linhas e colunas e usam SQL para consultas e manipulação.',
          advantages: 'Vantagens',
          limitations: 'Limitações',
          relational_adv_1: 'Forte consistência',
          relational_adv_2: 'Suporte a transações ACID (Atomicidade, Consistência, Isolamento, Durabilidade)',
          relational_adv_3: 'Familiaridade da comunidade',
          relational_adv_4: 'Estruturação de dados bem definida',
          relational_lim_1: 'Menos flexíveis para dados não estruturados',
          relational_lim_2: 'Dificuldade para escalar horizontalmente devido à estrutura rígida',
          examples_label: 'Exemplos:',
          examples_sql: 'MySQL, PostgreSQL, Oracle',
          nosql_title: 'Bancos de Dados NoSQL',
          nosql_p1: 'Bancos de dados não relacionais que oferecem flexibilidade para armazenar documentos, chave-valor, grafos ou colunas.',
          nosql_adv_1: 'Alta escalabilidade',
          nosql_adv_2: 'Flexibilidade de dados',
          nosql_adv_3: 'Suporte a grandes volumes de dados não estruturados',
          nosql_lim_1: 'Pode sacrificar consistência (consistência eventual) para garantir disponibilidade e escalabilidade',
          nosql_mongo_label: 'MongoDB (banco de documentos):',
          nosql_mongo_desc: 'Armazena dados no formato JSON/BSON',
          nosql_cassandra_label: 'Cassandra (banco de colunas):',
          nosql_cassandra_desc: 'Projetado para escalar horizontalmente garantindo alta disponibilidade',
          nosql_redis_label: 'Redis (chave-valor):',
          nosql_redis_desc: 'Banco em memória, extremamente rápido, usado para cache e outros fins',
          shard_part_rep_title: 'Sharding, Particionamento e Replicação',
          sharding_title: 'Sharding',
          sharding_p1: 'Como dividir uma grande biblioteca em várias salas menores para facilitar a organização e busca.',
          example: 'Exemplo:',
          sharding_example: 'Um e-commerce com milhões de usuários pode shardear por região, armazenando os usuários de cada região em servidores separados.',
          partitioning_title: 'Particionamento',
          partitioning_p1: 'Semelhante ao sharding, mas com diferentes critérios de organização (tamanho, tipo, frequência de uso).',
          partitioning_example: 'Em um banco de dados escolar, alunos podem ser particionados por ano letivo, cada ano em sua partição.',
          replication_title: 'Replicação',
          replication_p1: 'Criar cópias dos dados e armazená-las em múltiplos servidores para melhorar disponibilidade e durabilidade.',
          sync_rep_label: 'Replicação Síncrona:',
          sync_rep_desc: 'As cópias são escritas ao mesmo tempo, mantendo versões idênticas.',
          sync_rep_example: 'Um sistema bancário, onde cada transação precisa ser registrada em tempo real em todos os servidores.',
          async_rep_label: 'Replicação Assíncrona:',
          async_rep_desc: 'As cópias são atualizadas com atraso; podem existir pequenas diferenças, mas há backup.',
          async_rep_example: 'Um site de notícias em que as atualizações podem ser replicadas com pequeno atraso para servidores secundários.'
        },
        cards: {
          databases: {
            title: 'Bancos de Dados',
            description: 'Armazenamento e gerenciamento de dados em sistemas distribuídos.',
            badges: { persistence: 'Persistência', data: 'Dados' }
          },
          cache: {
            title: 'Cache',
            description: 'Armazenamento temporário para melhorar a performance e reduzir latência.',
            badges: { performance: 'Performance', speed: 'Velocidade' }
          },
          load_balancer: {
            title: 'Balanceador de Carga',
            description: 'Distribuição inteligente de tráfego entre múltiplos servidores.',
            badges: { distribution: 'Distribuição', scalability: 'Escalabilidade' }
          },
          message_queue: {
            title: 'Filas de Mensagens',
            description: 'Comunicação assíncrona e desacoplada entre serviços.',
            badges: { async: 'Assíncrono', messaging: 'Mensageria' }
          },
          cdn: {
            title: 'CDN',
            description: 'Distribuição global de conteúdo para melhor performance.',
            badges: { global: 'Global', content: 'Conteúdo' }
          },
          api_gateway: {
            title: 'API Gateway',
            description: 'Ponto único de entrada para gerenciamento de APIs.',
            badges: { routing: 'Roteamento', security: 'Segurança', control: 'Controle' }
          },
          firewall: {
            title: 'Firewall',
            description: 'Proteção e controle de tráfego em sistemas distribuídos.',
            badges: { security: 'Segurança', control: 'Controle' }
          }
        },
        cdn: {
          what_is_title: 'O que é uma CDN?',
          what_is_description: 'Uma CDN é uma rede de servidores distribuídos geograficamente, usados para entregar conteúdo (como arquivos de imagem, vídeos ou páginas web) de maneira rápida aos usuários. As CDNs armazenam cópias de conteúdo em diversos servidores ao redor do mundo, reduzindo a latência ao entregar o conteúdo a partir de um local mais próximo do usuário.',
          benefits_title: 'Benefícios de Usar CDN',
          benefit_latency_title: 'Redução de Latência',
          benefit_latency_desc: 'Os dados são entregues de um servidor próximo ao usuário, diminuindo o tempo de resposta.',
          benefit_load_title: 'Distribuição de Carga',
          benefit_load_desc: 'A CDN distribui a carga entre múltiplos servidores, evitando sobrecarga em servidores centrais.',
          benefit_availability_title: 'Maior Disponibilidade',
          benefit_availability_desc: 'Caso um servidor falhe, a CDN pode redirecionar o tráfego para outro servidor, garantindo alta disponibilidade.',
          example_label: 'Exemplo:',
          example_text: 'Usar uma CDN como o Cloudflare para acelerar o carregamento de páginas de um site global.',
          simulator_title: 'Simulador Interativo',
          simulator_description: 'Experimente nossa simulação de CDN para entender como a distribuição geográfica afeta latência e disponibilidade.',
          access_simulator: 'Acessar Simulador'
        },
        cache: {
          title: 'Cache',
          intro: 'Cache é uma camada de armazenamento temporário para dados frequentemente acessados, reduzindo latência e melhorando performance.',
          memcached_title: 'Memcached',
          memcached_p1: 'Pense no Memcached como um quadro branco na cozinha: rápido para escrever e ler, mas se apagar, o conteúdo some para sempre.',
          redis_title: 'Redis',
          redis_p1: 'Redis é como um armário com gavetas e prateleiras. Além de acesso rápido, permite estruturas complexas e persistência opcional.',
          compare_title: 'Comparando os dois:',
          simplicity_label: 'Simplicidade:',
          simplicity_desc: 'Memcached é mais simples (quadro branco). Redis é mais versátil (armário), porém exige mais organização.',
          datatypes_label: 'Tipos de dados:',
          datatypes_desc: 'Memcached armazena valores simples; Redis suporta listas, conjuntos e outras estruturas complexas.',
          persistence_label: 'Persistência:',
          persistence_desc: 'Memcached não persiste dados; Redis oferece persistência em disco para evitar data loss.',
          dist_vs_local_title: 'Cache Distribuído vs. Local',
          local_cache_label: 'Cache Local:',
          local_cache_desc: 'Armazena dados no mesmo servidor do processamento. Rápido, porém pouco escalável; cada servidor mantém sua própria versão.',
          distributed_cache_label: 'Cache Distribuído:',
          distributed_cache_desc: 'Compartilhado entre vários servidores, melhorando escalabilidade e consistência entre nós.',
          simulator_title: 'Simulador Interativo',
          simulator_description: 'Experimente nossa simulação de cache para entender como o cache impacta a performance do sistema.',
          access_simulator: 'Acessar Simulador',
          simulation: {
            client: 'Cliente',
            cache: 'Cache',
            database: 'BD',
            configuration: 'Configuração',
            cache_enabled: 'Cache Ativado',
            cache_ttl: 'Tempo de Vida do Cache',
            network_delay: 'Atraso de Rede',
            database_delay: 'Atraso do Banco',
            cache_key_placeholder: 'Chave do cache',
            processing: 'Processando...',
            send: 'Enviar',
            clear: 'Limpar',
            cache_status: 'Status do Cache',
            expires_in: 'expira em',
            cache_empty: 'Cache está vazio',
            logs: 'Registros',
            request: 'Requisição',
            cache_hit: 'Cache Encontrado',
            cache_miss: 'Cache Ausente',
            db_query: 'Consulta BD',
            no_logs: 'Nenhum registro disponível'
          }
        },
        load_balancer: {
          simulator_title: 'Simulador Interativo',
          simulator_description: 'Try our interactive load-balancing simulation to see how different algorithms behave in practice.',
          access_simulator: 'Access Simulator'
        },
        message_queue: {
          simulator_title: 'Simulador Interativo',
          simulator_description: 'Try our interactive message queue simulation to understand asynchronous communication between producers and consumers.',
          access_simulator: 'Access Simulator'
        },
        firewall: {
          title: 'Firewall',
          what_is_title: 'O que é um Firewall?',
          what_is_p: 'Um firewall é um componente de segurança essencial que monitora e controla o tráfego de rede com base em regras predefinidas. Atua como uma barreira entre uma rede confiável e redes não confiáveis (como a Internet), protegendo contra acessos não autorizados e ameaças.',
          features_title: 'Principais Funcionalidades',
          filtering_title: 'Filtragem de Pacotes',
          filtering_p: 'Analisa e filtra pacotes de rede com base em regras predefinidas, como endereços IP, portas e protocolos.',
          stateful_title: 'Inspeção de Estado',
          stateful_p: 'Mantém registro do estado das conexões ativas e toma decisões baseadas no contexto da comunicação.',
          ips_title: 'Prevenção de Intrusões',
          ips_p: 'Detecta e bloqueia tentativas de ataques e comportamentos maliciosos na rede.',
          types_title: 'Tipos de Firewall',
          net_fw_title: 'Firewall de Rede',
          net_fw_p: 'Opera na camada de rede, filtrando pacotes com base em endereços IP e portas.',
          app_fw_title: 'Firewall de Aplicação',
          app_fw_p: 'Analisa o tráfego no nível da aplicação, oferecendo proteção mais granular e específica.',
          example_label: 'Exemplo:',
          example_text: 'Configurar um firewall para permitir apenas tráfego HTTPS (porta 443) para um servidor web, bloqueando todas as outras portas.',
          simulator_title: 'Simulador Interativo',
          simulator_description: 'Experimente nosso simulador de Firewall para entender como regras de segurança afetam o tráfego de rede.',
          access_simulator: 'Acessar Simulador'
        },
        load_balancer_page: {
          title: 'Balanceadores de Carga',
          intro1: 'Os balanceadores de carga distribuem uniformemente o tráfego de rede ou solicitações entre vários servidores, evitando que um único servidor fique sobrecarregado. Por exemplo, um sistema e-commerce pode usar um balanceador de carga para distribuir as solicitações.',
          intro2: 'No balanceamento, várias instâncias de servidor processam as solicitações simultaneamente. Isso é essencial em sistemas escaláveis, permitindo adicionar mais servidores conforme a demanda aumenta.',
          algos_title: 'Algoritmos de Balanceamento',
          rr_title: 'Round Robin',
          rr_p: 'As solicitações são distribuídas sequencialmente entre os servidores disponíveis, garantindo uma divisão uniforme.',
          how_it_works: 'Como funciona:',
          rr_example: 'Se você tem 3 servidores (A, B, C), a primeira requisição vai para A, a segunda para B, a terceira para C, a quarta volta para A, e assim por diante.',
          hashing_title: 'Hashing',
          hashing_p: 'Utiliza um hash (baseado em IP ou outro identificador) para garantir que as solicitações de um cliente específico sejam direcionadas ao mesmo servidor.',
          use_case: 'Caso de uso:',
          hashing_example: 'Importante para manter sessões de usuários, garantindo que um cliente sempre acesse o mesmo servidor onde sua sessão está armazenada.',
          least_title: 'Least Connections',
          least_p: 'Direciona as novas solicitações para o servidor com menos conexões ativas, ajudando a equilibrar melhor a carga.',
          advantage: 'Vantagem:',
          least_example: 'Mais eficiente quando os servidores têm diferentes capacidades ou quando as requisições têm durações muito variadas.'
        },
        message_queue_page: {
          title: 'Filas de Mensagens',
          intro: 'Filas de mensagens são sistemas usados para comunicação assíncrona entre diferentes partes de um sistema, garantindo que mensagens possam ser enviadas e processadas de forma confiável.',
          kafka_title: 'Kafka',
          kafka_p: 'Um sistema de mensagens distribuído projetado para processar grandes volumes de dados em tempo real. Usado em pipelines de dados e sistemas de streaming.',
          rabbitmq_title: 'RabbitMQ',
          rabbitmq_p: 'Um broker de mensagens que suporta uma ampla variedade de padrões de mensagens, como filas e troca de mensagens, usado para comunicação entre microsserviços.',
          sqs_title: 'Amazon SQS',
          sqs_p: 'Serviço de fila de mensagens da AWS, que oferece uma solução de fila escalável e gerenciada na nuvem.',
          pubsub_title: 'Pub/Sub e Sistemas de Fila',
          pubsub_header: 'Pub/Sub (Publicação/Assinatura)',
          pubsub_p: 'Um padrão onde os produtores de mensagens (publicadores) enviam mensagens para um canal, e os consumidores (assinantes) se inscrevem para receber essas mensagens. O modelo Pub/Sub permite um desacoplamento entre produtores e consumidores.',
          fifo_header: 'Sistemas de Fila',
          fifo_p: 'As mensagens são colocadas em uma fila e processadas de forma FIFO (first-in, first-out), garantindo que as mensagens sejam entregues e processadas na ordem em que foram recebidas.'
        },
      },
      simulators: {
        consistent_hashing: {
          title: 'Simulador de Consistent Hashing',
          subtitle: 'Chaves num anel — adicione/remova nós e veja o remapeamento',
          controls: {
            vnodes: 'Nós virtuais por nó',
            keys: 'Número de chaves',
          },
          buttons: { add_node: 'Adicionar nó', remove_node: 'Remover nó', shuffle: 'Embaralhar chaves', reset: 'Resetar' },
          metrics: {
            title: 'Métricas ao Vivo',
            nodes: 'Nós',
            vnodes: 'Nós virtuais',
            keys: 'Chaves',
            moved: 'Chaves movidas',
            imbalance: 'Desbalanceamento',
          },
          labels: {
            node: 'Nó',
            hint: 'Adicione ou remova um nó — só as chaves destacadas se movem. Mais nós virtuais significa distribuição mais suave.',
          },
        },
        sharding: {
          title: 'Simulador de Sharding',
          subtitle: 'Roteie chaves para shards por faixa ou hash — e veja a desigualdade',
          controls: {
            shards: 'Número de shards',
            strategy: 'Estratégia',
            skew: 'Desigualdade',
          },
          strategies: { hash: 'Hash', range: 'Faixa' },
          buttons: { start: 'Iniciar', stop: 'Parar', reset: 'Resetar' },
          metrics: {
            title: 'Métricas ao Vivo',
            keys: 'Chaves roteadas',
            shards: 'Shards',
            imbalance: 'Desbalanceamento',
            hot_load: 'Shard mais quente',
          },
          labels: {
            shard: 'Shard',
            hint: 'Aumente a desigualdade com particionamento por faixa para criar um shard quente — depois mude para hash para equilibrar.',
          },
        },
        inverted_index: {
          title: 'Simulador de Índice Invertido',
          subtitle: 'Escolha termos de consulta e veja documentos ranqueados por pontuação',
          modes: { or: 'OR (qualquer termo)', and: 'AND (todos os termos)' },
          buttons: { clear: 'Limpar' },
          metrics: {
            title: 'Métricas ao Vivo',
            terms: 'Termos da consulta',
            matched: 'Docs encontrados',
            postings: 'Postings varridos',
            corpus: 'Tamanho do corpus',
          },
          labels: {
            query: 'Termos da consulta',
            documents: 'Documentos',
            index: 'Índice invertido',
            results: 'Resultados ranqueados',
            doc: 'Doc',
            score: 'pont.',
            no_matches: 'Nenhum documento correspondente',
            hint: 'AND intersecta as listas de postings; OR as une. A pontuação conta quantos termos da consulta cada documento contém.',
          },
        },
        kafka: {
          title: 'Simulador de Kafka',
          subtitle: 'Produtores, partições e um consumer group — veja o lag',
          controls: {
            partitions: 'Partições',
            consumers: 'Consumidores',
            produce_rate: 'Taxa de produção',
            consume_rate: 'Consumo / consumidor',
          },
          buttons: { start: 'Iniciar', stop: 'Parar', reset: 'Resetar' },
          metrics: {
            title: 'Métricas ao Vivo',
            produced: 'Produzidas',
            consumed: 'Consumidas',
            lag: 'Consumer lag',
            throughput: 'Capacidade de consumo',
          },
          labels: {
            partition: 'P',
            producer: 'Produtor',
            consumers: 'Consumer group',
            consumer: 'C',
            idle: 'ocioso',
            hint: 'Cada partição é lida por exatamente um consumidor. Adicione consumidores além do número de partições e eles ficam ociosos — as partições limitam o paralelismo.',
          },
        },
        saga: {
          title: 'Simulador de Saga',
          subtitle: 'Uma transação distribuída como uma sequência de passos compensáveis',
          controls: { mode: 'Coordenação', fail_at: 'Injetar falha no passo' },
          modes: { orchestrated: 'Orquestrada', choreographed: 'Coreografada' },
          fail_none: 'Nenhuma',
          buttons: { run: 'Rodar saga', reset: 'Resetar' },
          roles: { coordinator: 'Coordenador da Saga' },
          steps: {
            reserve: 'Reservar estoque',
            payment: 'Cobrar pagamento',
            shipping: 'Agendar envio',
            confirm: 'Enviar confirmação',
          },
          status: {
            pending: 'Pendente',
            running: 'Executando',
            done: 'Confirmado',
            failed: 'Falhou',
            compensated: 'Compensado',
          },
          metrics: { title: 'Resultado', committed: 'Passos confirmados', compensated: 'Passos compensados', outcome: 'Desfecho' },
          outcome: { idle: 'Inativo', committed: 'Confirmada', rolled_back: 'Revertida' },
          labels: {
            hint: 'Uma saga não tem rollback global. Quando um passo falha, cada passo concluído é desfeito por sua própria ação compensatória, em ordem reversa.',
          },
        },
        delivery_semantics: {
          title: 'Simulador de Semânticas de Entrega',
          subtitle: 'At-most-once vs at-least-once vs exactly-once',
          controls: { mode: 'Semântica', dedup: 'Deduplicação', dlq: 'Fila de dead-letter' },
          modes: { at_most_once: 'At-most-once', at_least_once: 'At-least-once', exactly_once: 'Exactly-once' },
          buttons: { start: 'Iniciar', stop: 'Parar', reset: 'Resetar', on: 'On', off: 'Off' },
          metrics: {
            title: 'Métricas ao Vivo',
            produced: 'Produzidas',
            delivered: 'Entregues',
            duplicates: 'Duplicatas',
            filtered: 'Filtradas (dedup)',
            lost: 'Perdidas',
            dlq: 'Dead-lettered',
          },
          tags: {
            delivered: 'Entregue',
            duplicate: 'Duplicata',
            lost: 'Perdida',
            dlq: 'Dead-letter',
            filtered: 'Filtrada',
          },
          labels: {
            recent: 'Mensagens recentes',
            empty: 'Nenhuma mensagem ainda',
            hint: 'At-most-once pode perder mensagens; at-least-once pode duplicá-las. "Exactly-once" = entrega at-least-once mais deduplicação no consumidor.',
          },
        },
        cqrs: {
          title: 'Simulador de CQRS',
          subtitle: 'Comandos anexam eventos; read models são projeções',
          controls: { lag: 'Lag da projeção' },
          commands: { create: 'Criar pedido', add_item: 'Adicionar item', ship: 'Enviar pedido', cancel: 'Cancelar pedido' },
          buttons: { reset: 'Resetar' },
          panels: { command: 'Lado de comando (escrita)', log: 'Log de eventos', read: 'Read models (consulta)' },
          events: { created: 'OrderCreated', item_added: 'ItemAdded', shipped: 'OrderShipped', cancelled: 'OrderCancelled' },
          read: { status: 'Status do pedido', items: 'Quantidade de itens', events_applied: 'Eventos aplicados', pending: 'Pendentes' },
          status_values: { none: '—', created: 'Criado', shipped: 'Enviado', cancelled: 'Cancelado' },
          labels: {
            log_empty: 'Nenhum evento ainda — emita um comando',
            lag_caption: 'Projeção atualizada: {{pct}}%',
            hint: 'Escritas vão para o log de eventos instantaneamente; read models atualizam de forma assíncrona. Aumente o lag para ver consistência eventual — a leitura fica atrás da escrita.',
          },
        },
        inference_batching: {
          title: 'Simulador de Batching de Inferência',
          subtitle: 'Continuous batching em uma GPU — vazão vs latência',
          controls: {
            arrival_rate: 'Taxa de chegada (req/s)',
            batch_capacity: 'Capacidade do lote (slots KV)',
            output_tokens: 'Média de tokens de saída',
          },
          buttons: { start: 'Iniciar', stop: 'Parar', reset: 'Reiniciar' },
          panels: {
            batch: 'Lote em Execução (GPU)',
            queue: 'Fila de Admissão',
            metrics: 'Métricas ao Vivo',
          },
          metrics: {
            throughput: 'Vazão (tok/s)',
            utilization: 'Utilização do lote',
            queue_depth: 'Tamanho da fila',
            avg_latency: 'Latência média',
            completed: 'Concluídas',
            dropped: 'Descartadas',
          },
          labels: {
            slot_free: 'slot livre',
            tokens: 'tok',
            waiting: 'esperando',
            batch_empty: 'GPU ociosa — nenhuma requisição no lote',
            queue_empty: 'Fila vazia',
            request: 'REQ',
          },
        },
        rag_pipeline: {
          title: 'Simulador de Pipeline RAG',
          subtitle: 'Embeddar → buscar → reordenar → montar → gerar',
          controls: {
            chunk_size: 'Tamanho do trecho (tokens)',
            top_k: 'Recuperar top-K',
            rerank: 'Reordenação',
          },
          buttons: { run: 'Executar Consulta', reset: 'Reiniciar', on: 'Ligado', off: 'Desligado' },
          stages: {
            embed: 'Embeddar Consulta',
            search: 'Busca Vetorial',
            rerank: 'Reordenar',
            assemble: 'Montar Contexto',
            generate: 'Gerar',
          },
          metrics: {
            recall: 'Recall da recuperação',
            latency: 'Latência total',
            cost: 'Custo / consulta',
            context: 'Contexto usado',
            quality: 'Qualidade da resposta',
          },
          labels: {
            idle: 'Ocioso — execute uma consulta para começar',
            chunk: 'trecho',
            score: 'score',
            retrieved: 'Trechos recuperados',
            disabled: 'desativado',
          },
        },
        vector_search: {
          title: 'Simulador de Busca Vetorial',
          subtitle: 'Vizinhos mais próximos aproximados com HNSW',
          controls: {
            ef_search: 'efSearch (lista de candidatos)',
            m_links: 'M (conexões do grafo)',
            dataset: 'Tamanho do dataset',
          },
          buttons: { search: 'Executar Busca', reset: 'Reiniciar' },
          metrics: {
            recall: 'Recall@10',
            latency: 'Latência da consulta',
            comparisons: 'Comp. de distância',
            memory: 'Memória do índice',
          },
          labels: {
            idle: 'Execute uma busca para sondar o índice',
            exact: 'Exata (força bruta)',
            approx: 'HNSW (aproximada)',
            found: 'Vizinhos encontrados',
          },
        },
        llm_gateway: {
          title: 'Simulador de Gateway de LLM',
          subtitle: 'Cache semântico, fallback de modelo, limite de taxa e custo',
          controls: {
            cache_rate: 'Taxa de acerto do cache (%)',
            rate_limit: 'Limite de taxa (req/s)',
            primary_fail: 'Falha do primário (%)',
          },
          buttons: { start: 'Iniciar', stop: 'Parar', reset: 'Reiniciar' },
          routes: {
            cache: 'Servido do cache',
            primary: 'Modelo primário',
            fallback: 'Modelo de fallback',
            rejected: 'Limitado por taxa',
          },
          metrics: {
            served: 'Atendidas',
            cache_hits: 'Acertos de cache',
            fallbacks: 'Fallbacks',
            rejected: 'Rejeitadas',
            cost: 'Custo total',
          },
          labels: {
            recent: 'Requisições recentes',
            empty: 'Nenhuma requisição ainda',
          },
        },
        gpu_autoscaler: {
          title: 'Simulador de Autoescalonador de GPU',
          subtitle: 'Partidas a frio, filas e escala-a-zero',
          controls: {
            arrival_rate: 'Taxa de chegada (req/s)',
            scale_threshold: 'Limiar de fila para escalar',
            cold_start: 'Partida a frio (s)',
          },
          buttons: { start: 'Iniciar', stop: 'Parar', reset: 'Reiniciar' },
          panels: {
            replicas: 'Réplicas de GPU',
            metrics: 'Métricas ao Vivo',
          },
          metrics: {
            replicas: 'Réplicas ativas',
            queue: 'Tamanho da fila',
            latency: 'Latência média',
            cost: 'Custo ($/min)',
            utilization: 'Utilização',
          },
          labels: {
            warming: 'AQUECENDO',
            ready: 'PRONTA',
            idle: 'OCIOSA',
            scale_to_zero: 'Escalado a zero — nenhuma GPU ativa',
          },
        },
        agent_orchestration: {
          title: 'Simulador de Orquestração de Agentes',
          subtitle: 'Laço raciocinar → agir → observar com chamadas de ferramentas',
          controls: {
            max_steps: 'Máx. de passos',
            tool_latency: 'Latência da ferramenta (ms)',
            fail_rate: 'Falha da ferramenta (%)',
          },
          buttons: { run: 'Executar Agente', reset: 'Reiniciar' },
          steps: {
            think: 'Pensar',
            act: 'Chamar Ferramenta',
            observe: 'Observar',
            answer: 'Resposta Final',
            retry: 'Repetir',
          },
          tools: {
            search: 'web_search',
            calculator: 'calculator',
            database: 'db_query',
          },
          metrics: {
            steps: 'Passos executados',
            tool_calls: 'Chamadas de ferramenta',
            retries: 'Tentativas',
            tokens: 'Tokens usados',
            status: 'Status',
          },
          labels: {
            idle: 'Ocioso — execute o agente para começar',
            running: 'Executando',
            done: 'Concluído',
            failed: 'Falhou (máx. de passos atingido)',
            trace: 'Trace de execução',
          },
        },
        gateway: {
          title: 'Simulador de API Gateway',
          description: 'Visualize como um API Gateway roteia diferentes tipos de requisições para os serviços apropriados em uma arquitetura de microsserviços.',
          buttons: {
            start: 'Iniciar Simulação',
            stop: 'Parar Simulação',
            show_config: 'Mostrar Configurações',
            hide_config: 'Ocultar Configurações',
            reset: 'Reiniciar',
            restore_defaults: 'Restaurar Padrões'
          },
          config: {
            title: 'Configurações da Simulação',
            rps: 'Requisições por Segundo: {{value}}',
            routing_delay: 'Delay de Roteamento: {{ms}}ms',
            extra_error_rate: 'Taxa de Erro Adicional: {{percent}}%',
            removal_delay: 'Tempo de Remoção: {{ms}}ms'
          },
          stats: {
            total: 'Total de Requisições',
            success: 'Requisições com Sucesso',
            error: 'Requisições com Erro'
          },
          columns: {
            clients: 'Clientes',
            apigw: 'API Gateway',
            microservices: 'Microsserviços'
          },
          items: {
            request_id: 'Requisição #{{id}}',
            type: 'Tipo: {{type}}',
            routing_to: 'Roteando #{{id}}',
            to_service: 'Para: {{service}}',
            processing_time: 'Tempo de processamento: {{ms}}ms',
            base_error_rate: 'Taxa de erro base: {{percent}}%',
            error: 'Erro',
            processing: 'Processando'
          }
        },
        retries: {
          title: 'Simulador de Retries',
          buttons: { settings: 'Configurações', start: 'Iniciar Simulação', simulating: 'Simulando...' },
          settings: {
            title: 'Configurações da Simulação',
            max_retries: 'Máximo de Retries: {{value}}',
            base_delay: 'Delay Base: {{ms}}ms',
            success_rate: 'Taxa de Sucesso: {{percent}}%'
          },
          toggles: { use_exponential_backoff: 'Usar Backoff Exponencial', add_jitter: 'Adicionar Jitter' },
          visualization: { title: 'Visualização' },
          attempt: { label: 'Tentativa {{id}}', next_in: 'Próxima tentativa em {{ms}}ms' },
          stats: { title: 'Estatísticas', total_attempts: 'Total de Tentativas', final_status: 'Status Final', status_success: 'Sucesso', status_failure: 'Falha' },
          info: {
            title: 'Explicação',
            p1: 'Este simulador demonstra como os mecanismos de retry funcionam em sistemas distribuídos. Cada tentativa tem uma chance de sucesso baseada na taxa configurada.',
            p2: 'Com backoff exponencial, o tempo entre tentativas aumenta progressivamente (1s, 2s, 4s, 8s...), reduzindo a carga do sistema.',
            p3: 'Jitter adiciona uma variação aleatória ao tempo entre tentativas, evitando que vários clientes tentem novamente ao mesmo tempo.'
          }
        },
        circuit_breaker: {
          title: 'Circuit Breaker',
          buttons: {
            settings: 'Configurações',
            start: 'Iniciar',
            stop: 'Parar',
            start_errors: 'Iniciar Erros',
            stop_errors: 'Parar Erros',
            reset: 'Resetar'
          },
          labels: {
            rps: 'Requisições/s:',
            state: 'Estado',
            reset_in: 'Reset em',
            consecutive_failures: 'Falhas Consecutivas',
            error_status: 'Status dos Erros',
            active_with_chance: 'Ativos ({{percent}}% de chance)',
            inactive: 'Inativos',
            latest_requests: 'Últimas Requisições',
            no_requests: 'Nenhuma requisição realizada'
          }
        },
        polling_webhooks: {
          title: 'Simulador: Polling vs Webhooks',
          subtitle: 'Veja na prática a diferença entre polling e webhooks com nossa simulação interativa',
          ctas: {
            read_theory: 'Ler Teoria Completa Primeiro',
            back_to_theory: 'Voltar para Teoria',
            back_to_components: 'Componentes Básicos'
          },
          buttons: {
            polling: 'Polling',
            webhook: 'Webhook',
            start: 'Iniciar',
            stop: 'Parar',
            reset: 'Resetar'
          },
          config: {
            polling_interval: 'Intervalo de Polling',
            data_generation: 'Geração de Dados',
            network_latency: 'Latência de Rede'
          },
          flow: {
            title: 'Fluxo de Comunicação',
            client: 'Cliente',
            server: 'Servidor',
            active_mode: 'Modo Ativo:',
            active_sim: '🟢 Simulação Ativa ({{mode}})',
            stopped_sim: '🔴 Simulação Parada'
          },
          stats: {
            title: 'Estatísticas em Tempo Real',
            total_requests: 'Total de Requisições',
            empty_responses: 'Respostas Vazias',
            data_transfers: 'Dados Transferidos',
            webhooks_sent: 'Webhooks Enviados',
            total_bandwidth_bits: 'Bandwidth Total (bits)',
            efficiency: 'Eficiência',
            success_rate: 'Taxa de Sucesso',
            wasted_requests: 'Requisições Desperdiçadas'
          },
          queue: {
            pending_data: 'Dados Pendentes ({{count}})',
            none: 'Nenhum dado pendente'
          },
          log: {
            title: 'Log de Mensagens',
            with_data: 'Com dados',
            start_prompt: 'Inicie a simulação para ver as mensagens...'
          },
          messages: {
            checking: 'Verificando novos dados...',
            data_found: 'Dados encontrados: {{content}}',
            no_data: 'Nenhum dado novo disponível'
          }
        },
        message_queue_sim: {
          title: 'Message Queue',
          buttons: {
            configure: 'Configurar',
            close_config: 'Fechar Config',
            start: 'Iniciar',
            stop: 'Parar',
            reset: 'Resetar'
          },
          config: {
            producers: 'Produtores',
            production_rate: 'Taxa de Produção',
            max_queue_size: 'Tamanho Máximo da Fila',
            consumers: 'Consumidores',
            consumption_rate: 'Taxa de Consumo',
            process_time: 'Tempo de Processamento'
          },
          flow: {
            title: 'Fluxo de Mensagens',
            queue: 'Fila',
            more: '+{{count}} mais'
          },
          queue_status: {
            title: 'Status da Fila',
            size: 'Tamanho da Fila',
            produced: 'Produzidas',
            processed: 'Processadas',
            dropped: 'Descartadas',
            avg_time: 'Tempo Médio'
          },
          messages: {
            title: 'Mensagens',
            none: 'Nenhuma mensagem ainda',
            accepted: 'Requisição aceita',
            rejected: 'Requisição rejeitada'
          }
        },
        rate_limiter: {
          title: 'Rate Limiter',
          strategy: 'Algoritmo',
          algorithms: {
            token: 'Token bucket',
            leaky: 'Leaky bucket',
            sliding: 'Janela deslizante'
          },
          algo_desc: {
            token: 'Tokens são repostos a uma taxa constante; cada requisição gasta um. Permite rajadas até o tamanho do bucket.',
            leaky: 'Requisições preenchem uma fila fixa que drena a uma taxa constante. Suaviza a saída; rejeita quando a fila enche.',
            sliding: 'Conta requisições na janela de 1s anterior; rejeita ao atingir o limite. Sem rajadas além do limite.'
          },
          level: {
            token: 'Tokens disponíveis',
            leaky: 'Profundidade da fila',
            sliding: 'Contagem na janela (1s)'
          },
          buttons: {
            configure: 'Configurar',
            close_config: 'Fechar Config',
            start: 'Iniciar',
            stop: 'Parar',
            reset: 'Resetar'
          },
          config: {
            token_rate: 'Reposição / vazamento / limite (por segundo)',
            message_rate: 'Taxa de Mensagens (por segundo)',
            bucket_size: 'Tamanho do bucket / fila'
          },
          bucket: {
            title: 'Token Bucket',
            rate: 'Taxa: {{rate}} /s'
          },
          recent: {
            title: 'Últimas Requisições',
            rate: 'Taxa: {{rate}} msgs/s',
            accepted: 'Requisição aceita',
            rejected: 'Requisição rejeitada',
            none: 'Nenhuma requisição ainda'
          },
          metrics: {
            total: 'Total de Requisições',
            accepted: 'Aceitas',
            rejected: 'Rejeitadas'
          }
        },
        backpressure: {
          title: 'Backpressure',
          buttons: {
            settings: 'Configurações',
            start: 'Iniciar',
            stop: 'Parar',
            reset: 'Resetar'
          },
          producer_status: {
            title: 'Status do Produtor',
            throttled: 'Throttled',
            normal: 'Normal'
          },
          labels: {
            produced: 'Mensagens Produzidas',
            processed: 'Mensagens Processadas',
            dropped: 'Mensagens Descartadas',
            latest: 'Últimas Mensagens'
          }
        },
        round_robin: {
          title: 'Load Balancer',
          buttons: {
            start: 'Iniciar Simulação',
            stop: 'Parar Simulação'
          },
          config: {
            strategy: 'Estratégia',
            server_count: 'Número de Servidores',
            server_capacity: 'Capacidade do Servidor',
            rps: 'Requisições por Segundo'
          },
          strategies: {
            round_robin: 'Round Robin: Distribui as requisições sequencialmente entre todos os servidores em ordem circular.',
            least_conn: 'Least Connections: Envia novas requisições para o servidor com menor carga atual.',
            random: 'Random: Seleciona aleatoriamente um servidor para cada nova requisição.'
          },
          server_card: {
            server_label: 'Servidor {{id}}',
            requests: '{{current}}/{{capacity}} requisições',
            response_time_ms: '({{ms}}ms)',
            response_time_label: 'Tempo de Resposta:'
          }
        },
        cdn: {
          title: 'Simulação de CDN',
          buttons: { configure: 'Configurar', close_config: 'Fechar Config', reset: 'Reiniciar' },
          config: {
            title: 'Configurações',
            base_latency_multiplier: 'Multiplicador de Latência Base (Sem Cache)',
            cache_latency_multiplier: 'Multiplicador de Latência com Cache',
            max_logs: 'Número Máximo de Logs'
          },
          labels: {
            x_suffix: 'x',
            logs_suffix: 'logs',
            country_select: 'Selecione seu país:',
            datacenters: 'Datacenters:',
            cache_badge: 'Cache ✓',
            latency: 'Latência'
          },
          messages: { processing: 'Processando requisição...' },
          history: { title: 'Histórico de Requisições:', cache_hit: 'Cache Hit' },
          info: {
            title: 'Como funciona?',
            i1: 'Selecione seu país para simular uma requisição',
            i2: 'O datacenter mais próximo será escolhido automaticamente',
            i3: 'Primeira requisição: Busca do servidor de origem ({{base}}x a latência)',
            i4: 'Requisições subsequentes: Servidas do cache local ({{cache}}x a latência)',
            i5: 'A latência varia de acordo com a distância entre seu país e o datacenter'
          }
        },
        firewall: {
          title: 'Simulador de Firewall',
          lead: 'Este simulador demonstra como um firewall filtra pacotes de rede com base em regras predefinidas. Observe como diferentes tipos de tráfego são permitidos ou bloqueados.',
          rules: { title: 'Regras do Firewall', restore_title: 'Restaurar configuração inicial', add_rule: 'Adicionar Regra', remove_rule_title: 'Remover regra' },
          stats: { title: 'Estatísticas', total: 'Total de Pacotes', allowed: 'Permitidos', blocked: 'Bloqueados' },
          traffic: { title: 'Tráfego de Rede', custom_packet: 'Pacote Personalizado', generate_packet: 'Gerar Pacote', stop_autogen: 'Parar', start_autogen: 'Auto Gerar' },
          labels: { port: 'Porta', protocol: 'Protocolo', type: 'Tipo', payload: 'Payload', action_allow: 'Permitir', action_block: 'Bloquear' },
          badges: { allow: 'PERMITIDO', block: 'BLOQUEADO' },
          empty: 'Nenhum pacote gerado ainda. Clique em "Gerar Pacote" para começar.',
          add_rule_modal: {
            title: 'Nova Regra',
            origin: 'Origem',
            destination: 'Destino',
            port: 'Porta',
            protocol: 'Protocolo',
            type: 'Tipo',
            action: 'Ação',
            placeholder_ip_or_star: 'IP ou *',
            placeholder_port_or_zero: 'Porta ou 0',
            option_select: 'Selecione',
            button_cancel: 'Cancelar',
            button_add: 'Adicionar'
          },
          custom_packet_modal: {
            title: 'Enviar Pacote Personalizado',
            origin: 'Origem',
            destination: 'Destino',
            port: 'Porta',
            protocol: 'Protocolo',
            type: 'Tipo',
            payload: 'Payload',
            placeholder_origin_ip: 'IP (ex: 192.168.1.1)',
            placeholder_destination_ip: 'IP (ex: 10.0.0.1)',
            placeholder_port: 'Porta (ex: 80)',
            placeholder_payload: 'Dados do pacote',
            button_cancel: 'Cancelar',
            button_send: 'Enviar Pacote'
          },
          errors: {
            source_required: 'O IP de origem é obrigatório',
            destination_required: 'O IP de destino é obrigatório',
            port_required: 'A porta é obrigatória'
          },
          info: {
            title: 'Como funciona?',
            i1: 'O simulador gera pacotes de rede aleatórios com diferentes origens, destinos e portas',
            i2: 'As regras do firewall são avaliadas em ordem, da primeira à última',
            i3: 'A primeira regra que corresponde ao pacote determina se ele será permitido ou bloqueado',
            i4: 'A última regra (default) bloqueia todo o tráfego não especificado nas regras anteriores',
            i5: 'Você pode adicionar suas próprias regras e ver como elas afetam o tráfego',
            i6: 'Use o modo "Auto Gerar" para ver um fluxo contínuo de pacotes'
          }
        },
        
        
        horizontal_scaling: {
          title: 'Simulador de Escalabilidade Horizontal',
          intro: 'Visualize como a carga é distribuída entre múltiplos servidores e como o sistema escala automaticamente baseado na demanda.',
          controls: {
            request_rate: 'Taxa de Requisições/s',
            processing_time_ms: 'Tempo de Processamento (ms)',
            auto_scaling: 'Auto-Scaling',
            scale_up: 'Scale Up:',
            scale_down: 'Scale Down:',
            percent: '%'
          },
          buttons: {
            start: 'Iniciar',
            stop: 'Parar',
            add_server: 'Adicionar Servidor',
            remove_server: 'Remover Servidor'
          },
          server_card: {
            server_label: 'Servidor {{id}}',
            active: 'Ativo',
            inactive: 'Inativo',
            load: 'Carga',
            processed_requests: 'Requisições processadas: {{count}}'
          },
          requests: {
            recent: 'Últimas Requisições',
            server_label: 'Servidor {{id}}',
            status_completed: 'Concluído',
            status_failed: 'Falhou',
            status_processing: 'Processando'
          }
        },
        vertical_scaling: {
          title: 'Simulador de Escalabilidade Vertical',
          intro: 'Gerencie recursos do servidor e observe como ele lida com diferentes cargas de trabalho.',
          level_of_total: 'Nível {{current}} de {{total}}',
          buttons: { downgrade: 'Downgrade', upgrade: 'Upgrade', start: 'Iniciar Simulação', stop: 'Stop Simulation' },
          resources: { cpu: 'CPU ({{cores}} núcleos)', memory: 'Memória ({{gb}} GB)', storage: 'Armazenamento ({{gb}} GB)' },
          queue_title: 'Fila de Requisições',
          controls_title: 'Controles',
          request_rate: 'Taxa de Requisições ({{rate}}/s)',
          stats_title: 'Estatísticas',
          processed: 'Processadas', rejected: 'Rejeitadas', success_rate: 'Taxa de Sucesso', uptime: 'Tempo Ativo', total_cost: 'Custo Total', current_load: 'Carga Atual',
          statuses: { healthy: 'saudável', degraded: 'degradado', failed: 'falho', role: 'Papel', data: 'Dados', keys: 'chaves', replicated_after: 'Replicado após {{seconds}}s' },
          simulate_failure: 'Simular Falha', recover: 'Recuperar',
          upgrade_modal: { title: 'Aumentar Servidor', text: 'Deseja aumentar para {{tier}}? Isso aumentará seus custos para R${{cost}}/mês.', cancel: 'Cancelar', confirm: 'Aumentar' }
        },
        scalability: {
          title: 'Simulador de Escalabilidade',
          intro: 'Explore como consistência, latência e failover funcionam em um sistema distribuído.',
          how_title: 'Como usar o simulador:',
          how_steps: [
            'Configure o modo de consistência: Forte (replicação instantânea) ou Eventual (replicação com latência)',
            'Ajuste a latência de rede e veja o efeito na replicação (valores maiores mostram atrasos eventuais)',
            'Experimente cenários: simule falhas (failover), compare propagação de consistência, observe impactos nas requisições'
          ],
          config_title: 'Configurações',
          consistency_mode: 'Modo de Consistência',
          strong: 'Forte', eventual: 'Eventual',
          network_latency_ms: 'Latência de Rede (ms)',
          failure_rate: 'Taxa de Falha',
          auto_failover: 'Auto Failover',
          manual_title: 'Operação Manual',
          read: 'Leitura', write: 'Escrita',
          key_placeholder: 'Chave', value_placeholder: 'Valor', execute: 'Executar',
          start: 'Iniciar Simulação', stop: 'Parar Simulação',
          role: 'Papel', latency: 'Latência', data: 'Dados', keys_label: '{{count}} chaves', replicated_after: 'Replicado após {{seconds}}s',
          simulate_failure: 'Simular Falha', recover: 'Recuperar',
          recent_requests: 'Requisições Recentes',
          read_label: 'Leitura', write_label: 'Escrita'
        },

        timeout: {
          title: 'Simulador de Timeout',
          buttons: { settings: 'Configurações', start: 'Iniciar', stop: 'Parar', reset: 'Reiniciar' },
          settings: {
            title: 'Configurações da Simulação',
            timeout: 'Timeout: {{seconds}}s',
            rps: 'Requisições por Segundo: {{value}}',
            min_response: 'Tempo Mínimo de Resposta: {{seconds}}s',
            max_response: 'Tempo Máximo de Resposta: {{seconds}}s',
            success_rate: 'Taxa de Sucesso: {{percent}}%'
          },
          visualization: { title: 'Visualização' },
          request_label: 'Requisição {{id}}',
          statuses: { success: 'Requisição completada com sucesso', timeout: 'Timeout: Requisição excedeu {{seconds}}s', error: 'Erro do servidor' },
          stats: { title: 'Estatísticas', total: 'Total de Requisições', timeouts: 'Timeouts' },
          info: {
            title: 'Explicação',
            p1: 'Este simulador demonstra como o mecanismo de timeout funciona em sistemas distribuídos. Cada requisição tem um tempo limite configurável para ser completada.',
            p2: 'Se a resposta não chegar dentro do tempo limite, a requisição é cancelada e um erro de timeout é retornado, evitando que recursos fiquem presos indefinidamente.',
            p3: 'Ajuste timeout, tempos de resposta e taxa de sucesso para visualizar impactos.'
          }
        },
        event_sourcing: {
          title: 'Simulador de Event Sourcing',
          buttons: { settings: 'Configurações', reset: 'Reiniciar', replay: 'Replay' },
          intro: 'Explore como o Event Sourcing funciona em um sistema de e-commerce, onde cada mudança de estado é registrada como um evento imutável.',
          settings: {
            title: 'Configurações da Simulação',
            auto_advance: 'Avançar automaticamente',
            event_delay: 'Delay entre Eventos: {{ms}}ms',
            show_event_data: 'Mostrar dados dos eventos',
            animation_duration: 'Duração da Animação: {{seconds}}s'
          },
          create_order: {
            title: 'Criar Pedido',
            selected_items: 'Itens Selecionados:',
            total: 'Total: R$ {{amount}}',
            create_button: 'Criar Pedido'
          },
          actions: {
            pay: 'Confirmar Pagamento',
            ship: 'Enviar Pedido',
            deliver: 'Confirmar Entrega',
            cancel: 'Cancelar Pedido'
          },
          state: {
            title: 'Estado Atual',
            order: 'Pedido: {{id}}',
            status: 'Status: {{status}}',
            total: 'Total: R$ {{amount}}',
            tracking: 'Rastreamento: {{code}}',
            items: 'Itens:'
          },
          events: {
            title: 'Eventos',
            speed: 'Velocidade:',
            speed_opts: { half: '0.5s', one: '1s', two: '2s' }
          }
        },
        canary: {
          title: 'Simulador de Canary Deployment',
          buttons: {
            settings: 'Configurações',
            deploy_canary: 'Deploy Canary',
            pause: 'Pausar',
            resume: 'Retomar',
            increase_traffic: '+10% Tráfego',
            promote: 'Promover para 100%',
            rollback: 'Rollback',
            inject_errors: 'Injetar Erros',
            stop_errors: 'Parar Erros',
            reset: 'Resetar'
          },
          settings: {
            title: 'Configurações da Simulação',
            canary_traffic: 'Tráfego Canary: {{percent}}%',
            canary_error_rate: 'Taxa de Erro Canary: {{percent}}%',
            rps: 'Requisições/seg: {{value}}',
            rollback_threshold: 'Limite para Auto-Rollback: {{percent}}%'
          },
          labels: {
            phase: 'Fase',
            stable_servers: 'Servidores Estáveis',
            canary_server: 'Servidor Canary',
            traffic: 'tráfego',
            requests: 'Requisições',
            errors: 'Erros',
            metrics: 'Métricas',
            total_requests: 'Total de Requisições',
            canary_requests: 'Requisições Canary',
            canary_error_rate: 'Taxa de Erro Canary',
            stable_error_rate: 'Taxa de Erro Estável',
            live_requests: 'Requisições em Tempo Real',
            no_requests: 'Nenhuma requisição ainda. Faça deploy de um canary para começar.',
            event_log: 'Log de Eventos',
            waiting_logs: 'Aguardando eventos...'
          },
          logs: {
            deploying_canary: '🚀 Fazendo deploy da versão canary...',
            canary_deployed: '✅ Canary implantado com sucesso',
            promoting_canary: '📈 Promovendo canary para 100%...',
            promotion_complete: '✅ Promoção completa - canary agora é estável',
            rolling_back: '⚠️ Revertendo para versão estável...',
            rollback_complete: '✅ Rollback completo',
            simulation_reset: '🔄 Simulação reiniciada',
            traffic_increased: '📈 Tráfego aumentado para {{percent}}%',
            auto_rollback_triggered: '🚨 Auto-rollback ativado! Taxa de erro: {{rate}}%'
          },
          info: {
            title: 'ℹ️ Como Usar',
            try_this: {
              title: 'Experimente:',
              item1: 'Faça deploy de um canary e observe a distribuição de tráfego',
              item2: 'Aumente gradualmente o tráfego para o canary',
              item3: 'Injete erros para ver o auto-rollback em ação',
              item4: 'Promova o canary quando estiver confiante'
            },
            observe: {
              title: 'Observe:',
              item1: 'Taxas de erro entre estável e canary',
              item2: 'Distribuição de requisições entre servidores',
              item3: 'Auto-rollback quando o limite é excedido'
            },
            real_world: {
              title: 'Mundo Real:',
              text: 'Em produção, você monitoraria latência, taxas de erro e métricas de negócio antes de promover um canary.'
            }
          }
        },

        coupling: {
          title: 'Acoplamento em Sistemas Distribuídos',
          intro: 'O acoplamento mede quão conectados/ dependentes são os componentes. Em sistemas distribuídos, seu tipo e nível impactam flexibilidade, manutenibilidade e resiliência.',
          key_concept_label: 'Conceito Chave',
          key_concept_text: 'Quanto menor o acoplamento, maior a flexibilidade e manutenção — mas acoplamento extremamente baixo pode aumentar a complexidade. Equilíbrio é essencial.',
          types_title: 'Tipos de Acoplamento',
          static_title: 'Acoplamento Estático',
          characteristics_title: 'Características',
          advantages_title: 'Vantagens',
          disadvantages_title: 'Desvantagens',
          example_static_title: 'Exemplo de Acoplamento Estático',
          dynamic_title: 'Acoplamento Dinâmico',
          example_dynamic_title: 'Exemplo de Acoplamento Dinâmico',
          service_discovery_title: 'Service Discovery',
          service_discovery_intro: 'Service Discovery é um padrão fundamental para acoplamento dinâmico em sistemas distribuídos. Permite que serviços se encontrem e se comuniquem sem conhecimento prévio de localizações.',
          components_title: 'Componentes Principais',
          components: { registry: 'Registro de Serviços', health: 'Health Checking', dns: 'DNS Dinâmico' },
          tools_title: 'Ferramentas Populares',
          best_practices_title: 'Melhores Práticas',
          design_arch_title: 'Design e Arquitetura',
          implementation_title: 'Implementação',
          tradeoffs_title: 'Trade-offs e Considerações',
          real_world_title: 'Exemplos do Mundo Real'
        },

      },
      polling_webhooks_theory: {
        title: 'Polling vs Webhooks',
        subtitle: 'Entenda as diferenças fundamentais entre essas duas estratégias de comunicação',
        problem_title: 'O Problema da Comunicação',
        problem_polling_title: '📤 Polling (Consulta)',
        problem_polling_text: '"Vou perguntar de tempos em tempos se há algo novo"',
        problem_webhook_title: '🔔 Webhooks (Notificação)',
        problem_webhook_text: '"Me avise imediatamente quando houver algo novo"',
        polling_title: '📤 Polling (Consulta Periódica)',
        how_it_works: 'Como Funciona',
        typical_flow: 'Fluxo Típico:',
        advantages: 'Vantagens',
        disadvantages: 'Desvantagens',
        when_to_use_polling: '💡 Quando Usar Polling',
        webhooks_title: '🔔 Webhooks (Notificações Push)',
        when_to_use_webhooks: '💡 Quando Usar Webhooks',
        comparison_title: '⚖️ Comparação Detalhada',
        table: {
          aspect: 'Aspecto',
          polling: '📤 Polling',
          webhooks: '🔔 Webhooks',
          latency: 'Latência',
          bandwidth: 'Uso de Banda',
          complexity: 'Complexidade',
          scalability: 'Escalabilidade',
          network_requirements: 'Requisitos de Rede',
          control: 'Controle',
          debugging: 'Debugging',
          reliability: 'Reliability'
        },
        real_world_title: '🌍 Exemplos do Mundo Real',
        polling_use_cases: '📤 Casos de Uso - Polling',
        webhook_use_cases: '🔔 Casos de Uso - Webhooks',
        implementation_title: '🛠️ Considerações de Implementação',
        implementing_polling: 'Implementando Polling',
        common_strategies: '🔧 Estratégias Comuns',
        important_care: '⚠️ Cuidados Importantes',
        implementing_webhooks: 'Implementando Webhooks',
        essential_security: '🔒 Segurança Essencial',
        reliability_patterns: '🔄 Reliability Patterns',
        hybrid_title: '🔄 Abordagens Híbridas',
        card_fallback: '🔄 Fallback Strategy',
        card_realtime_batch: '⚡ Real-time + Batch',
        card_context_aware: '🎯 Context-Aware',
        cta_title: '🚀 Pronto para Ver na Prática?',
        cta_subtitle: 'Agora que você entende os conceitos, experimente nosso simulador interativo para ver a diferença em ação!'
      },
      design_principles: {
        index: {
          title: 'Princípios de Design',
          subtitle: 'Explore os princípios fundamentais que orientam a criação de sistemas distribuídos',
          banner1: 'Cada princípio aborda aspectos cruciais do design de sistemas distribuídos modernos.',
          banner2: 'Entenda como aplicá-los para criar sistemas escaláveis e resilientes.',
          cards: {
            event_driven: {
              title: 'Desenvolvimento Orientado a Eventos',
              description: 'Event Sourcing e sistemas de eventos distribuídos.',
              badge1: 'Eventos',
              badge2: 'Assíncrono'
            },
            service_oriented: {
              title: 'Design Orientado a Serviços',
              description: 'Microsserviços vs Arquitetura Monolítica.',
              badge1: 'Serviços',
              badge2: 'Arquitetura'
            },
            fault_tolerance: {
              title: 'Tolerância a Falhas',
              description: 'Retries, Circuit Breakers, Timeout e Fallback.',
              badge1: 'Resiliência',
              badge2: 'Recuperação'
            },
            scalability: {
              title: 'Design para Escalabilidade',
              description: 'Escalabilidade horizontal e vertical.',
              badge1: 'Crescimento',
              badge2: 'Performance'
            },
            high_availability: {
              title: 'Alta Disponibilidade',
              description: 'Zonas de disponibilidade e replicação.',
              badge1: 'Uptime',
              badge2: 'Replicação'
            }
          }
        },
        event_driven: {
          title: 'Desenvolvimento Orientado a Eventos',
          intro: 'O desenvolvimento orientado a eventos é uma abordagem em que as ações e mudanças no sistema são desencadeadas e gerenciadas por eventos. Um evento é qualquer ação significativa que ocorra no sistema, como uma transação de compra ou a atualização de um banco de dados.',
          event_sourcing_title: 'Event Sourcing',
          event_sourcing_p: 'O event sourcing é um padrão de design em que o estado de um sistema é derivado de uma sequência de eventos, em vez de um estado atual armazenado. Cada mudança de estado é capturada como um evento imutável, e o sistema pode ser reconstruído a qualquer momento ao reproduzir esses eventos.',
          advantages_title: 'Vantagens',
          advantages_list: [
            'Histórico completo de mudanças no sistema',
            'Fácil de auditar e rastrear ações',
            'Suporte para reverter ou "replays" de eventos'
          ],
          example_title: 'Exemplo',
          event_sourcing_example: 'Um sistema de e-commerce em que cada atualização do estado de um pedido (pedido realizado, processado, enviado) é registrado como um evento. O estado final do pedido é determinado pela sequência de eventos.',
          dist_events_title: 'Sistemas de Eventos Distribuídos',
          dist_events_p: 'Sistemas de eventos distribuídos permitem que diferentes partes de um sistema (frequentemente em diferentes servidores) se comuniquem e sincronizem com base em eventos. Eles são fundamentais para sistemas assíncronos, onde diferentes componentes podem reagir a eventos de maneira descentralizada.',
          tools_title: 'Ferramentas Populares',
          tools_list: ['Apache Kafka', 'RabbitMQ', 'Amazon SNS'],
          dist_example_title: 'Exemplo',
          dist_example_p: 'Uma aplicação de pagamento que publica eventos de confirmação de pagamento, os quais são consumidos por diferentes serviços para atualizar inventário, notificar o usuário e gerar faturas.',
          sim_title: 'Simulador Interativo',
          sim_desc: 'Experimente nossa simulação interativa de Event Sourcing para entender melhor como os eventos são registrados e processados em um sistema distribuído.',
          sim_cta: 'Acessar Simulador'
        },
        scalability: {
          overview: {
            title: 'Design para Escalabilidade',
            intro: 'Escalabilidade é a capacidade de um sistema lidar com aumento de carga, seja aumentando a capacidade de hardware ou distribuindo a carga entre várias instâncias.',
            tiles: {
              horizontal_title: 'Escalabilidade Horizontal',
              horizontal_desc: 'Distribua a carga entre múltiplos servidores adicionando mais máquinas.',
              vertical_title: 'Escalabilidade Vertical',
              vertical_desc: 'Aumente recursos em um único servidor como RAM, CPU, ou armazenamento.',
              consistency_title: 'Consistência de Dados',
              consistency_desc: 'Garanta que todas as cópias de dados estejam sincronizadas entre servidores.',
              latency_title: 'Latência',
              latency_desc: 'Gerencie atrasos na entrega de dados ou respostas no sistema.',
              failover_title: 'Failover',
              failover_desc: 'Alternativa automática para sistema de backup em caso de falha.'
            },
            sim_cta: 'Explorar Simulador de Escalabilidade'
          },
          horizontal: {
            title: 'Escalabilidade Horizontal (Scale-Out)',
            intro: 'Método que adiciona mais servidores para trabalhar em conjunto, dividindo a carga entre eles.',
            how_title: 'Como Funciona',
            how_p: 'É como usar vários carros para transportar passageiros em vez de depender de um único carro maior. Essa abordagem é comum em sistemas modernos, especialmente na nuvem.',
            example_title: 'Exemplo Prático',
            example_p: 'Uma rede de streaming de vídeos que começou com um único servidor percebe crescimento global. Para atender à demanda, adiciona servidores em várias regiões, compartilhando a carga e entregando conteúdo mais rapidamente.',
            advantages_title: 'Vantagens',
            advantages: [
              'Escalabilidade Ilimitada: Adicione mais servidores conforme necessário',
              'Alta Disponibilidade: Se um servidor falha, outros continuam',
              'Custo-Benefício: Pode usar hardware simples/commodity'
            ],
            considerations_title: 'Considerações Importantes',
            considerations: [
              'Distribuição de Dados: Planeje como distribuir e sincronizar os dados',
              'Complexidade: Exige mecanismos de coordenação e balanceamento de carga',
              'Consistência: Manter dados consistentes entre servidores é desafiador'
            ],
            best_practices_title: 'Melhores Práticas',
            best_practices: [
              'Automação: Automatize a adição/remoção de servidores do cluster',
              'Monitoramento: Monitore para identificar gargalos e problemas',
              'Redundância: Mantenha redundância adequada para alta disponibilidade'
            ],
            sim_cta: 'Explorar Simulador de Escalabilidade'
          },
          vertical: {
            title: 'Escalabilidade Vertical (Scale-Up)',
            intro: 'Estratégia que melhora o desempenho de um único servidor adicionando recursos como RAM, armazenamento ou processadores mais rápidos.',
            how_title: 'Como Funciona',
            how_p: 'É como trocar um carro pequeno por um maior para transportar mais passageiros. Embora simples de implementar, há um limite físico: o servidor atinge sua capacidade máxima.',
            example_title: 'Exemplo Prático',
            example_p: 'Uma loja virtual que usa um servidor básico faz upgrade para um mais potente por aumento de tráfego. Resolve no curto prazo, mas com crescimento contínuo pode não ser suficiente.',
            advantages_title: 'Vantagens',
            advantages: [
              'Simplicidade: Fácil de implementar e gerenciar',
              'Menor Complexidade: Não requer mudanças na arquitetura',
              'Solução Rápida: Ideal para problemas imediatos de performance'
            ],
            limitations_title: 'Limitações',
            limitations: [
              'Limite Físico: Há um máximo de melhorias possíveis em um servidor',
              'Custo: Hardware mais potente custa exponencialmente mais',
              'Ponto Único de Falha: Se falhar, todo o sistema cai'
            ],
            when_title: 'Quando Usar',
            when: [
              'Aplicações Pequenas: Tráfego moderado e crescimento previsível',
              'Solução Temporária: Correção rápida para performance',
              'Sistemas Monolíticos: Aplicações não projetadas para distribuição'
            ],
            sim_cta: 'Explorar Simulador de Escalabilidade'
          },
          latency: {
            title: 'Latência',
            intro: 'Latência é o atraso na entrega de dados ou respostas dentro de um sistema. Em sistemas distribuídos, especialmente em múltiplas regiões, a latência pode aumentar devido à distância física ou à complexidade de comunicação.',
            impact_title: 'O Impacto da Latência',
            impact_p: 'A latência pode afetar significativamente a experiência do usuário e o desempenho do sistema. Pequenos atrasos podem impactar métricas de negócio e satisfação do usuário.',
            types_title: 'Tipos de Latência',
            types: [
              'Latência de Rede: Tempo para um pacote viajar entre dois pontos na rede.',
              'Latência de Processamento: Tempo para processar uma requisição e gerar resposta.',
              'Latência de Armazenamento: Tempo para ler ou escrever dados no armazenamento.'
            ],
            strategies_title: 'Estratégias de Otimização',
            strategies: [
              'CDN: Aproximar dados dos usuários com redes de distribuição de conteúdo.',
              'Caching: Armazenar dados frequentemente acessados mais próximos ao usuário.',
              'Edge Computing: Processar dados próximo à origem para reduzir atrasos.'
            ],
            best_title: 'Melhores Práticas',
            best: [
              'Monitoramento: Métricas detalhadas para identificar gargalos de latência.',
              'Otimização de Código: Manter código eficiente e otimizado.',
              'Distribuição Geográfica: Distribuir recursos em diferentes regiões.'
            ],
            sim_cta: 'Explorar Simulador de Escalabilidade'
          },
          failover: {
            title: 'Failover em Sistemas Distribuídos',
            intro: 'Failover é uma estratégia crítica para garantir a continuidade do serviço em caso de falhas, permitindo recuperação automática e minimizando indisponibilidade.',
            what_is_title: 'O que é Failover?',
            what_is_p: 'Mecanismo de recuperação automática que transfere operações de um sistema falho para um backup ou sistema secundário, mantendo o serviço disponível.',
            types_title: 'Tipos de Failover',
            types: [
              'Ativo-Passivo: Sistema primário processa requisições e o secundário fica em standby; se o primário falhar, o secundário assume.',
              'Ativo-Ativo: Múltiplos sistemas processam simultaneamente; falhas são absorvidas pelos demais.',
              'Failover em Cascata: Vários níveis de backup, cada um assume em ordem predefinida.'
            ],
            components_title: 'Componentes Essenciais',
            components: [
              'Monitoramento de saúde (Health Check)',
              'Detecção de falhas',
              'Mecanismo de transição',
              'Sincronização de estado',
              'Recuperação automática'
            ],
            real_world_title: 'Exemplo do Mundo Real',
            real_world_p: 'Um serviço de streaming com failover em múltiplas regiões. Se um datacenter na Ásia falhar, o tráfego é redirecionado para Europa/América, mantendo disponibilidade.',
            best_title: 'Melhores Práticas',
            best: [
              'Teste regularmente os mecanismos de failover',
              'Automatize detecção e transição',
              'Mantenha logs detalhados',
              'Configure timeouts e thresholds',
              'Implemente monitoramento em tempo real',
              'Documente procedimentos de failover e recuperação'
            ],
            explore_title: 'Explorar na Prática',
            explore_p: 'Experimente diferentes estratégias de failover e veja o impacto na disponibilidade.',
            explore_cta: 'Abrir Simulador'
          },

        },

        availability: {
          index: {
            title: 'Alta Disponibilidade',
            intro: 'Alta disponibilidade é a capacidade de um sistema manter-se operacional e acessível mesmo em situações de falha, garantindo continuidade do serviço por meio de redundância e recuperação automática.',
            cards: {
              replication_title: 'Replicação',
              replication_desc: 'Mantenha cópias sincronizadas de dados/serviços para redundância e distribuição de carga.',
              failover_title: 'Failover',
              failover_desc: 'Mecanismos automáticos de recuperação que detectam falhas e redirecionam tráfego.',
              zones_title: 'Zonas de Disponibilidade',
              zones_desc: 'Distribua a aplicação em várias zonas para proteger contra falhas localizadas.',
              dr_title: 'Recuperação de Desastres',
              dr_desc: 'Planeje e implemente estratégias de recuperação em falhas catastróficas.',
              monitoring_title: 'Monitoramento de Saúde',
              monitoring_desc: 'Monitore continuamente a saúde do sistema para detectar problemas cedo.',
              load_dist_title: 'Distribuição de Carga',
              load_dist_desc: 'Distribua tráfego entre servidores para evitar sobrecarga e manter resposta.'
            },
            sim_cta: 'Explorar Simulador de Alta Disponibilidade'
          },
          replication: {
            title: 'Replicação em Sistemas Distribuídos',
            intro: 'A replicação é fundamental para garantir alta disponibilidade e redundância.',
            what_title: 'O que é Replicação?',
            what_p: 'Replicação consiste em criar e manter cópias de dados ou serviços em vários locais. Isso aumenta a disponibilidade e a redundância, garantindo acesso mesmo se um servidor falhar.',
            types_title: 'Tipos de Replicação',
            types: [
              'Replicação Síncrona: Todas as cópias são atualizadas antes de confirmar (consistência forte, maior latência).',
              'Replicação Assíncrona: Atualizações propagam com atraso (melhor performance, consistência eventual).',
              'Replicação Semi-síncrona: Híbrido em que ao menos uma réplica confirma antes de prosseguir.'
            ],
            benefits_title: 'Benefícios',
            benefits: [
              'Alta disponibilidade e tolerância a falhas',
              'Distribuição geográfica para menor latência',
              'Balanceamento de carga entre réplicas',
              'Backup e recuperação de desastres',
              'Escalabilidade de leitura'
            ],
            real_world_title: 'Exemplo do Mundo Real',
            real_world_p: 'Uma rede social armazena fotos em múltiplos servidores pelo mundo. Se um falhar, outra cópia evita perda e mantém o serviço online.',
            best_title: 'Melhores Práticas',
            best: [
              'Escolha o tipo de replicação conforme a necessidade de consistência',
              'Monitore a saúde e o estado das réplicas',
              'Implemente mecanismos de detecção e resolução de conflitos',
              'Mantenha logs de replicação para auditoria e recuperação',
              'Teste regularmente os cenários de failover',
              'Considere a localização geográfica das réplicas'
            ],
            explore_title: 'Explorar na Prática',
            explore_p: 'Experimente diferentes estratégias de replicação e veja o impacto na consistência e latência.',
            explore_cta: 'Abrir Simulador'
          },
          availability_zones: {
            title: 'Zonas de Disponibilidade',
            intro: 'Zonas de Disponibilidade são datacenters isolados dentro de uma região geográfica, projetados para fornecer redundância e alta disponibilidade para aplicações críticas.',
            how_works_title: 'Como Funciona',
            how_works_intro: 'Cada zona de disponibilidade é um datacenter independente com:',
            how_works_items: [
              'Energia própria e redundante',
              'Refrigeração independente',
              'Infraestrutura de rede dedicada',
              'Conexões de alta velocidade entre zonas'
            ],
            how_works_outro: 'As zonas são projetadas para serem isoladas de falhas em outras zonas, mas próximas o suficiente para garantir baixa latência na comunicação entre elas.',
            benefits_title: 'Benefícios',
            benefits: [
              {
                title: 'Isolamento de Falhas',
                description: 'Problemas em uma zona não afetam as outras, garantindo a continuidade do serviço.'
              },
              {
                title: 'Alta Disponibilidade',
                description: 'Distribuição de recursos entre zonas garante que o serviço permaneça disponível mesmo com a falha de uma zona inteira.'
              },
              {
                title: 'Baixa Latência',
                description: 'Conexões de alta velocidade entre zonas permitem sincronização eficiente de dados e balanceamento de carga.'
              }
            ],
            real_world_title: 'Exemplo do Mundo Real',
            real_world_example_title: 'E-commerce de Grande Porte',
            real_world_intro: 'Um e-commerce distribui sua aplicação em três zonas de disponibilidade:',
            real_world_items: [
              'Zona A: Servidor principal de aplicação',
              'Zona B: Réplica ativa e banco de dados principal',
              'Zona C: Backup e banco de dados secundário'
            ],
            real_world_outro: 'Se a Zona A falhar, o tráfego é automaticamente redirecionado para a Zona B, enquanto a Zona C garante que nenhum dado seja perdido durante a transição.',
            best_practices_title: 'Melhores Práticas',
            best_practices: [
              {
                title: 'Distribuição Inteligente',
                description: 'Distribua recursos e dados de forma equilibrada entre as zonas para maximizar a resiliência.'
              },
              {
                title: 'Monitoramento Constante',
                description: 'Implemente monitoramento em tempo real para detectar e responder rapidamente a problemas em qualquer zona.'
              },
              {
                title: 'Testes Regulares',
                description: 'Realize testes de failover regularmente para garantir que a transição entre zonas funcione conforme esperado.'
              }
            ],
            simulator_title: 'Explorar o Simulador de Zonas de Disponibilidade',
            simulator_description: 'Experimente na prática como as zonas de disponibilidade funcionam e como elas respondem a diferentes cenários de falha.'
          },
          availability_zones_simulator: {
            title: 'Simulador de Zonas de Disponibilidade',
            intro: 'Explore como as zonas de disponibilidade trabalham em conjunto para garantir alta disponibilidade e tolerância a falhas.',
            controls: {
              request_rate_label: 'Taxa de Requisições (por segundo)',
              failure_chance_label: 'Chance de Falha (%)',
              auto_failover_label: 'Auto Failover',
              start_simulation: 'Iniciar Simulação',
              stop_simulation: 'Parar Simulação'
            },
            zone_status: {
              healthy: 'Saudável',
              degraded: 'Degradado',
              failed: 'Falha'
            },
            zone_info: {
              load: 'Carga',
              active_servers: 'Servidores Ativos',
              latency: 'Latência',
              simulate_failure: 'Simular Falha',
              recover: 'Recuperar'
            },
            statistics: {
              title: 'Estatísticas',
              total_requests: 'Total de Requisições',
              success_rate: 'Taxa de Sucesso'
            },
            recent_requests: {
              title: 'Requisições Recentes',
              completed: 'Concluída',
              failed: 'Falha',
              processing: 'Processando',
              pending: 'Pendente'
            }
          }
        },

        fault_tolerance: {
          title: 'Tolerância a Falhas',
          intro: 'Projetar sistemas que possam se recuperar ou continuar operando diante de falhas é essencial para manter a confiabilidade e a alta disponibilidade.',
          example_label: 'Exemplo Prático',
          strategy: {
            retries: {
              title: 'Retries',
              description: 'Quando uma operação falha, o sistema tenta executá-la novamente, aumentando a chance de sucesso em caso de falhas temporárias.',
              example: 'Em um aplicativo de compras online, se a confirmação do pedido falhar devido a problemas de rede, o app tenta enviar a requisição novamente automaticamente.'
            },
            circuit_breakers: {
              title: 'Circuit Breakers',
              description: 'Previne falhas em cascata ao detectar problemas e interromper temporariamente as chamadas a um serviço com problemas.',
              example: 'Quando um servidor de imagens está sobrecarregado, o circuit breaker impede novas requisições por um tempo, permitindo que o servidor se recupere.'
            },
            timeout: {
              title: 'Timeout',
              description: 'Define um tempo máximo para a conclusão de uma operação, evitando que o sistema fique esperando indefinidamente por uma resposta.',
              example: 'Ao preencher um formulário online, se o servidor não responder em 30 segundos, a operação é cancelada e uma mensagem de erro é exibida.'
            },
            fallback: {
              title: 'Fallback',
              description: 'Fornece uma alternativa quando a operação principal falha, garantindo que o sistema continue funcionando mesmo que de forma degradada.',
              example: 'Em um aplicativo de mapas, se o GPS falhar, o sistema usa a localização da rede Wi‑Fi como alternativa para mostrar a posição aproximada.'
            }
          }
        },

        retries: {
          title: 'Retries',
          intro: 'Uma estratégia fundamental para lidar com falhas temporárias em sistemas distribuídos, permitindo que operações falhas sejam automaticamente repetidas.',
          how_it_works: {
            title: 'Como Funciona',
            text: 'Imagine que você está enviando uma mensagem para um amigo. Às vezes, a mensagem não chega de primeira por causa de problemas na rede. O que você faz? Tenta enviar de novo. É exatamente isso que o "Retry" faz em sistemas computacionais.'
          },
          real_world_example: {
            title: 'Exemplo do Mundo Real',
            text: 'Pense em um aplicativo de compras online. Quando você clica em "Comprar", o app precisa confirmar o pedido com um servidor. Se a conexão falhar momentaneamente, o app pode tentar novamente algumas vezes antes de exibir um erro.'
          },
          benefits: {
            title: 'Benefícios',
            items: {
              resilience: { title: 'Maior Resiliência', desc: 'Sistemas podem se recuperar automaticamente de falhas temporárias.' },
              ux: { title: 'Melhor Experiência', desc: 'Usuários não precisam repetir ações manualmente em caso de falhas.' },
              reliability: { title: 'Confiabilidade', desc: 'Aumenta a taxa de sucesso das operações em redes instáveis.' }
            }
          },
          best_practices: {
            title: 'Melhores Práticas',
            items: {
              backoff: { title: 'Backoff Exponencial', desc: 'Aumentar gradualmente o intervalo entre tentativas para evitar sobrecarga do sistema (ex.: 1s, 2s, 4s, 8s).' },
              limit: { title: 'Limite de Tentativas', desc: 'Definir um número máximo de tentativas para evitar loops infinitos e falhar rapidamente quando necessário.' },
              idempotency: { title: 'Idempotência', desc: 'Garantir que múltiplas tentativas da mesma operação não causem efeitos colaterais indesejados.' }
            }
          },
          considerations: {
            title: 'Considerações Importantes',
            items: {
              failure_types: { title: 'Tipos de Falhas', desc: 'Nem todas as falhas devem ser retentadas. Erros de validação ou autenticação, por exemplo, não se beneficiam de retentativas.' },
              impact: { title: 'Impacto no Sistema', desc: 'Muitas retentativas simultâneas podem sobrecarregar o sistema. Use circuit breakers em conjunto quando necessário.' }
            }
          },
          cta_simulator: 'Explorar Simulador de Retries'
        },
        circuit_breaker: {
          title: 'Circuit Breaker',
          intro: 'Uma estratégia essencial para prevenir falhas em cascata em sistemas distribuídos, funcionando de forma similar a um disjuntor elétrico.',
          how_it_works: {
            title: 'Como Funciona',
            p1: 'Imagine que a internet da sua casa está com problemas sérios. Você tenta enviar uma mensagem várias vezes, mas ela nunca chega. Ficar insistindo só te frustra e sobrecarrega a rede. É aí que entra o Circuit Breaker.',
            p2: 'Ele funciona como um disjuntor: quando há muitas falhas, bloqueia novas tentativas por um tempo para evitar danos e permitir recuperação.'
          },
          benefits: {
            title: 'Benefícios',
            items: {
              cascade_prevention: { title: 'Prevenção de Falhas em Cascata', desc: 'Evita que falhas em um serviço afetem todo o sistema.' },
              auto_recovery: { title: 'Recuperação Automática', desc: 'Permite que o sistema se recupere naturalmente após falhas.' },
              better_experience: { title: 'Melhor Experiência', desc: 'Falha rápido em vez de deixar usuários esperando.' }
            }
          },
          real_world: {
            title: 'Exemplo do Mundo Real',
            text: 'Um site de notícias recebe pico de tráfego. O servidor de imagens sobrecarrega e responde lentamente. O Circuit Breaker bloqueia buscas por alguns minutos, mantendo o site no ar enquanto o servidor se recupera.'
          },
          states: {
            title: 'Estados do Circuit Breaker',
            closed: { title: 'Fechado (Normal)', desc: 'Operação normal; requisições passam enquanto falhas são monitoradas.' },
            open: { title: 'Aberto (Bloqueado)', desc: 'Muitas falhas detectadas; requisições são bloqueadas por um período.' },
            half_open: { title: 'Semi-Aberto (Teste)', desc: 'Permite algumas requisições para testar se o sistema se recuperou.' }
          },
          cta_simulator: 'Explorar Simulador de Circuit Breaker'
        },
        consistency_strategies: {
          index: {
            title: 'Estratégias de Consistência',
            subtitle: 'Explore diferentes mecanismos para garantir consistência em sistemas distribuídos',
            info: 'A consistência é um dos principais desafios em sistemas distribuídos. Entenda como diferentes estratégias ajudam a manter a ordem e a coerência dos dados.',
            cards: {
              two_phase_commit_title: 'Two-Phase Commit',
              two_phase_commit_desc: 'Garanta consistência em transações distribuídas usando o protocolo Two-Phase Commit (2PC).',
              consensus_title: 'Estratégia de Consenso',
              consensus_desc: 'Entenda como sistemas distribuídos alcançam acordo usando protocolos de consenso.',
              lamport_title: 'Relógios Lógicos de Lamport',
              lamport_desc: 'Descubra como timestamps de Lamport ordenam eventos distribuídos e garantem consistência causal.'
            },
            coming_soon_title: 'Em Breve',
            coming_soon_p: 'Mais estratégias de consistência serão adicionadas em breve, incluindo:',
            coming_soon_items: ['Relógios Vetoriais', 'Consistência Eventual']
          },
          // Consensus Strategy (PT)
          consensus: {
            title: 'Estratégias de Consenso',
            intro: 'Entenda como os sistemas distribuídos alcançam acordo em decisões críticas usando protocolos de consenso.',
            what_is_title: 'O que é Consenso?',
            what_is_p: 'Consenso é um dos problemas fundamentais em sistemas distribuídos. É o processo pelo qual um grupo de nós concorda em um valor ou decisão comum, mesmo na presença de falhas.',
            raft_title: 'Protocolo Raft',
            raft_intro: 'Raft é um protocolo de consenso projetado para ser mais compreensível que o Paxos. Ele divide o problema em três subproblemas independentes:',
            raft_points: ['Eleição de líder', 'Replicação de log', 'Garantia de segurança'],
            raft_example_title: 'Exemplo Prático',
            raft_example_p: 'Em um cluster de 5 nós executando Raft, quando o líder falha, os seguidores iniciam uma nova eleição após um timeout. O nó que receber a maioria dos votos se torna o novo líder.',
            paxos_title: 'Protocolo Paxos',
            paxos_intro: 'Paxos é um protocolo de consenso que garante consistência em um sistema distribuído, mesmo quando nós podem falhar ou mensagens podem ser perdidas.',
            paxos_how_title: 'Como Funciona',
            paxos_phases_intro: 'O protocolo opera em duas fases principais:',
            paxos_phases: ['Fase 1: Prepare/Promise', 'Fase 2: Propose/Accept'],
            zookeeper_title: 'ZooKeeper',
            zookeeper_intro: 'ZooKeeper é um serviço de coordenação para sistemas distribuídos que implementa seu próprio protocolo de consenso (ZAB - ZooKeeper Atomic Broadcast).',
            zookeeper_features_title: 'Características',
            zookeeper_features: ['Ordenação total de atualizações', 'Atomicidade', 'Consistência sequencial', 'Durabilidade'],
            pros_cons_title: 'Vantagens e Desvantagens',
            advantages_title: 'Vantagens',
            advantages_list: ['Forte consistência', 'Tolerância a falhas', 'Recuperação automática', 'Garantia de ordem'],
            disadvantages_title: 'Desvantagens',
            disadvantages_list: ['Maior latência', 'Complexidade de implementação', 'Overhead de comunicação', 'Necessidade de quórum'],
            cta_title: 'Experimente na Prática',
            cta_p: 'Use nosso simulador interativo para entender melhor como os protocolos de consenso funcionam em diferentes cenários.',
            cta_button: 'Acessar Simulador'
          },
          // Consensus Simulator (PT)
          consensus_simulator: {
            title: 'Simulador de Consenso',
            controls: {
              protocol_label: 'Protocolo:',
              options: { raft: 'Raft', paxos: 'Paxos', zookeeper: 'ZooKeeper' },
              start: 'Iniciar',
              pause: 'Pausar',
              restart: 'Reiniciar',
              speed_label: 'Velocidade:',
              speed_opts: { slow: 'Lento', normal: 'Normal', fast: 'Rápido' },
              show_explanations: 'Mostrar Explicações',
              hide_explanations: 'Ocultar Explicações'
            },
            step_prefix: 'Passo',
            cluster_vis_title: 'Visualização do Cluster',
            roles: {
              follower: 'Seguidor', candidate: 'Candidato', leader: 'Líder',
              proposer: 'Propositor', acceptor: 'Aceitador', learner: 'Aprendiz', participant: 'Participante'
            },
            labels: {
              node_label: 'Nó',
              term_label: 'Termo',
              log_label: 'Log',
              proposal_label: 'Proposta',
              promised_label: 'Prometido',
              accepted_label: 'Aceito',
              value_label: 'Valor',
              learned_value_label: 'Valor Aprendido',
              zxid_label: 'zxid',
              data_label: 'Dados',
              watching_label: 'Watching: {{path}}',
              last_event_label: 'Último Evento: {{event}}'
            },
            legend: {
              legend_title: 'Legenda:',
              node_states_title: 'Estados dos Nós:',
              message_types_title: 'Tipos de Mensagens:'
            },
            messages: {
              vote_request: 'Solicitação de Voto',
              vote_response: 'Resposta de Voto',
              log_replication: 'Replicação de Log',
              prepare: 'Prepare',
              promise: 'Promise',
              propose: 'Propose',
              accept: 'Accept',
              watch: 'Watch',
              replication: 'Replicação',
              notification: 'Notificação'
            },
            progress_label: 'Progresso: {{percent}}%'
          },
          // Lamport Timestamps Page (PT)
          lamport_timestamps: {
            title: 'Relógios Lógicos de Lamport',
            intro: 'Entenda como os timestamps de Lamport estabelecem ordem em eventos distribuídos.',
            overview_title: 'Visão Geral',
            problem_title: 'O Problema',
            problem_p1: 'Em sistemas distribuídos, não existe um relógio global que todos os processos possam consultar. Cada processo tem seu próprio relógio local, que pode divergir dos demais.',
            solution_title: 'A Solução',
            solution_p1: 'Os relógios lógicos de Lamport estabelecem uma ordem parcial de eventos baseada na relação "aconteceu antes", permitindo determinar a causalidade entre eventos distribuídos.',
            how_title: 'Como Funciona',
            basic_rules_title: 'Regras Básicas',
            basic_rules: [
              'Cada processo mantém um contador que é incrementado em eventos locais',
              'Ao enviar uma mensagem, o processo inclui seu timestamp atual',
              'Ao receber uma mensagem, o processo atualiza seu contador para o máximo entre seu valor local e o timestamp recebido + 1'
            ],
            properties_title: 'Propriedades',
            properties: [
              'Se evento A causou evento B, então timestamp(A) < timestamp(B)',
              'Se timestamp(A) < timestamp(B), então A pode ter causado B',
              'Se timestamp(A) = timestamp(B), então A e B são concorrentes'
            ],
            applications_title: 'Aplicações',
            use_cases_title: 'Casos de Uso',
            use_cases: [
              'Ordenação de mensagens em sistemas de mensageria distribuídos',
              'Detecção de condições de corrida em sistemas concorrentes',
              'Manutenção de consistência em bancos de dados distribuídos',
              'Sincronização de estados em jogos multiplayer'
            ],
            limitations_title: 'Limitações',
            limitations: [
              'Não capturam relações de concorrência (eventos que aconteceram em paralelo)',
              'Não fornecem um tempo global absoluto',
              'Podem gerar ordenações diferentes em diferentes execuções do sistema'
            ],
            example_title: 'Exemplo Prático',
            chat_system_title: 'Sistema de Chat Distribuído',
            chat_intro: 'Em um sistema de chat distribuído, os timestamps de Lamport podem ser usados para:',
            chat_points: [
              'Ordenar mensagens de diferentes usuários',
              'Garantir que respostas apareçam depois das mensagens originais',
              'Detectar e resolver conflitos de edição'
            ],
            cta_title: 'Experimente na Prática',
            cta_p: 'Use nosso simulador interativo para entender melhor como os relógios lógicos de Lamport funcionam em diferentes cenários.',
            cta_button: 'Acessar Simulador'
          },
          // Lamport Timestamps Simulator (PT)
          lamport_timestamps_simulator: {
            title: 'Simulador de Timestamps de Lamport',
            subtitle: 'Visualize como os timestamps lógicos são atualizados em um sistema distribuído',
            info: 'Adicione eventos locais ou envie mensagens entre processos para ver como os timestamps de Lamport são atualizados. Observe como a ordem dos eventos é mantida através dos relógios lógicos.',
            controls: { reset: 'Reiniciar Simulação' },
            process_label: 'Processo {{n}}',
            buttons: { local_event: 'Evento Local', send_to: '→ {{target}}' },
            timeline: { clock_prefix: 't = ' },
            event_labels: { local: 'Evento Local', send_prefix: '→ {{target}}', receive_prefix: '← {{source}}' },
            legend: { title: 'Legenda', local: 'Evento Local', sent: 'Mensagem Enviada', received: 'Mensagem Recebida' }
          }
        },
        // Two-Phase Commit (PT)
        two_phase_commit: {
          title: 'Two-Phase Commit (2PC)',
          intro: 'Entenda como o protocolo Two-Phase Commit garante consistência em transações distribuídas.',
          overview_title: 'Visão Geral',
          phase1_title: 'Fase 1: Preparação',
          phase1_p: 'O coordenador solicita que todos os participantes se preparem para a transação. Cada participante verifica se pode realizar a operação e responde ao coordenador.',
          phase2_title: 'Fase 2: Commit',
          phase2_p: 'Com base nas respostas dos participantes, o coordenador decide se a transação deve ser confirmada (commit) ou abortada (rollback).',
          labels: {
            coordinator: 'Coordenador',
            participant: 'Participante {{n}}'
          },
          features_title: 'Características',
          advantages_title: 'Vantagens',
          advantages_list: [
            'Garante consistência forte dos dados',
            'Previne transações parciais',
            'Processo de decisão transparente',
            'Atomicidade garantida',
            'Isolamento entre transações'
          ],
          limitations_title: 'Limitações',
          limitations_list: [
            'Bloqueante (participantes aguardam decisão)',
            'Sensível a falhas do coordenador',
            'Maior latência devido às duas fases',
            'Overhead de comunicação',
            'Possibilidade de deadlocks'
          ],
          use_cases_title: 'Casos de Uso',
          banking_title: 'Sistemas Bancários',
          banking_p: 'Transferências entre contas que envolvem múltiplos bancos ou sistemas. Garante que o dinheiro não seja perdido ou duplicado.',
          ecommerce_title: 'E-commerce',
          ecommerce_p: 'Processamento de pedidos que envolvem estoque, pagamento e logística. Assegura que todas as etapas sejam concluídas com sucesso.',
          reservations_title: 'Reservas',
          reservations_p: 'Sistemas de reserva de hotéis, voos ou eventos que precisam coordenar múltiplos recursos simultaneamente.',
          cta_title: 'Experimente na Prática',
          cta_p: 'Use nosso simulador interativo para entender melhor como o Two-Phase Commit funciona em diferentes cenários.',
          cta_button: 'Acessar Simulador'
        },
        // Two-Phase Commit Simulator (PT)
        two_phase_commit_simulator: {
          title: 'Simulador de Two Phase Commit',
          intro: 'Este simulador demonstra o protocolo Two Phase Commit em uma transferência bancária distribuída. Configure as respostas dos bancos clicando neles antes de iniciar a simulação.',
          controls: {
            start: 'Iniciar',
            pause: 'Pausar',
            simulation: 'Simulação',
            reset: 'Reiniciar',
            speed_label: 'Velocidade:',
            speed_opts: { slow: 'Lenta', normal: 'Normal', fast: 'Rápida' }
          },
          nodes: {
            coordinator: 'Coordenador',
            bank_n: 'Banco {{n}}'
          },
          node_states: {
            idle: 'ocioso', preparing: 'preparando', prepared: 'preparado', committed: 'confirmado', aborted: 'abortado'
          },
          responses: { yes: 'sim', no: 'não' },
          config: {
            configure_response: 'Configurar resposta:',
            approve: 'Aprovar',
            reject: 'Rejeitar',
            status: 'Status:',
            will_approve: 'Irá aprovar a transação',
            will_reject: 'Irá rejeitar a transação'
          },
          messages: {
            prepare_q: 'Preparar para transferência?',
            vote_yes: 'Sim, pronto para commit',
            vote_no: 'Não, recursos indisponíveis',
            decision_commit: 'Commit: execute a transferência',
            decision_abort: 'Abort: cancele a operação',
            done: 'Operação finalizada com sucesso'
          },
          steps: {
            current_phase: 'Fase Atual:',
            s0: 'Clique nos bancos para configurar suas respostas e então inicie a simulação',
            s1: "Fase 1: Coordenador enviou 'prepare' para todos os participantes",
            s2: 'Fase 1: Participantes responderam com seus votos',
            s3: 'Fase 2: Coordenador tomou a decisão final',
            s4: 'Simulação concluída! Você pode reiniciar para ver novamente.'
          }
        },
        // Added synchronization pages (PT)
        synchronization: {
          title: 'Sincronização em Sistemas Distribuídos',
          intro: 'A sincronização é um dos desafios fundamentais em sistemas distribuídos. Ela garante que diferentes processos ou serviços coordenem suas ações de forma eficiente e segura.',
          key_concept_label: 'Conceito Chave',
          key_concept_text: 'A sincronização eficiente é crucial para manter a consistência e evitar condições de corrida em sistemas distribuídos. No entanto, é importante encontrar o equilíbrio entre sincronização e performance.',
          fundamentals: {
            title: 'Fundamentos',
            basics_title: 'Conceitos Básicos',
            basics_p: 'A sincronização em sistemas distribuídos envolve vários conceitos fundamentais que precisam ser compreendidos para implementar soluções eficientes.',
            mutual_exclusion: 'Exclusão Mútua',
            shared_resources: 'Recursos Compartilhados',
            shared_resources_desc: 'Garantia de acesso exclusivo a recursos',
            race_conditions: 'Condições de Corrida',
            race_conditions_desc: 'Prevenção de conflitos de acesso',
            coordination: 'Coordenação',
            consensus: 'Consenso',
            consensus_desc: 'Acordo entre processos distribuídos',
            ordering: 'Ordenação',
            ordering_desc: 'Sequenciamento de eventos distribuídos'
          },
          topics: {
            title: 'Tópicos',
            fundamentals_title: 'Fundamentos',
            fundamentals_p: 'Aprenda os conceitos básicos de sincronização usando o exemplo clássico do Jantar dos Filósofos.',
            badges: { mutual_exclusion: 'Exclusão Mútua', race_conditions: 'Condições de Corrida' },
            deadlocks_title: 'Deadlocks',
            deadlocks_p: 'Entenda como prevenir e detectar deadlocks em sistemas distribuídos.',
            deadlocks_badges: { prevention: 'Prevenção', detection: 'Detecção' },
            algorithms_title: 'Algoritmos',
            algorithms_p: 'Explore diferentes algoritmos de sincronização distribuída.',
            algorithms_badges: { bakery: 'Algoritmo do Padeiro', token_ring: 'Token Ring' }
          },
          best_practices: {
            title: 'Melhores Práticas',
            design_impl_title: 'Design e Implementação',
            minimize_sync_label: 'Minimize a Sincronização',
            minimize_sync_desc: 'Use sincronização apenas quando necessário',
            granularity_label: 'Granularidade Apropriada',
            granularity_desc: 'Escolha o nível certo de sincronização',
            timeout_recovery_label: 'Timeout e Recuperação',
            timeout_recovery_desc: 'Implemente mecanismos de timeout e recuperação',
            monitoring_debugging_title: 'Monitoramento e Debugging',
            detailed_logging_label: 'Logging Detalhado',
            detailed_logging_desc: 'Mantenha logs detalhados de operações de sincronização',
            performance_metrics_label: 'Métricas de Performance',
            performance_metrics_desc: 'Monitore o impacto da sincronização na performance',
            deadlock_detection_label: 'Detecção de Deadlocks',
            deadlock_detection_desc: 'Implemente mecanismos de detecção de deadlocks'
          },
          next_steps: {
            title: 'Próximos Passos',
            deadlocks_title: 'Deadlocks',
            deadlocks_p: 'Aprenda mais sobre como identificar, prevenir e resolver deadlocks em sistemas distribuídos.',
            deadlocks_badges: { detection: 'Detecção', prevention: 'Prevenção' },
            algorithms_title: 'Algoritmos',
            algorithms_p: 'Explore diferentes algoritmos de sincronização distribuída e suas aplicações.',
            algorithms_badges: { bakery: 'Algoritmo do Padeiro', token_ring: 'Token Ring' }
          }
        },
        synchronization_fundamentals: {
          title: 'Fundamentos da Sincronização',
          intro_p1: 'O problema do Jantar dos Filósofos é um exemplo clássico que ilustra os desafios fundamentais da sincronização em sistemas distribuídos.',
          intro_p2: 'Vamos explorar como ele nos ajuda a entender conceitos importantes como exclusão mútua, deadlocks e starvation.',
          key_concept_label: 'Conceito Chave',
          key_concept_text: 'O Jantar dos Filósofos foi proposto por Edsger Dijkstra em 1965 e continua sendo uma excelente ferramenta para entender os desafios de sincronização em sistemas distribuídos modernos.',
          illustration_title: 'Ilustração do Problema',
          philosophers: ['Platão', 'Aristóteles', 'Kant', 'Sócrates', 'Descartes'],
          statuses: { thinking: 'Pensando', eating: 'Comendo', hungry: 'Com fome', waiting: 'Esperando' },
          legend: { thinking: 'Pensando', eating: 'Comendo' },
          dining_title: 'O Jantar dos Filósofos',
          illustration_caption: 'Cinco filósofos sentados em uma mesa redonda, cada um com um prato de macarrão e um garfo entre cada par de filósofos. Para comer, um filósofo precisa pegar dois garfos adjacentes, mas há apenas cinco garfos no total.',
          strategies_title: 'Estratégias de Sincronização',
          strategies: {
            naive: 'Naive: Filósofos simplesmente tentam pegar o garfo da esquerda e depois o da direita. Facilmente gera deadlock.',
            ordered: 'Ordenada: Filósofos sempre pegam o garfo de menor número primeiro, prevenindo deadlocks.',
            waiter: 'Garçom: Um "garçom" garante que apenas um filósofo por vez possa tentar pegar ambos os garfos.'
          },
          significance_title: 'Significado e Aplicações',
          significance_p1: 'O problema do Jantar dos Filósofos é mais do que um exercício acadêmico - é um modelo que representa desafios reais em sistemas distribuídos modernos. Cada filósofo representa um processo ou thread que precisa acessar recursos compartilhados (os garfos) de forma segura e eficiente.',
          significance_p2: 'Em sistemas reais, este problema se manifesta em diversos cenários: bancos de dados distribuídos gerenciando transações concorrentes, sistemas de arquivos distribuídos controlando acesso a recursos compartilhados, ou redes de sensores coordenando a coleta de dados. A solução deste problema é fundamental para garantir a confiabilidade e eficiência de sistemas distribuídos.',
          analogy_title: 'Analogia com Sistemas Reais',
          analogy_points: ['Filósofos = Processos/Threads', 'Garfos = Recursos Compartilhados', 'Comer = Execução de Operações Críticas', 'Pensar = Processamento Independente'],
          modern_challenges_title: 'Desafios Modernos',
          modern_challenges: ['Escalabilidade em Sistemas Distribuídos', 'Tolerância a Falhas', 'Balanceamento de Carga', 'Garantia de Justiça no Acesso'],
          problem_section: {
            title: 'O Problema',
            scenario_title: 'Cenário',
            items: { philosophers: '5 Filósofos', round_table: 'Sentados em uma mesa redonda', forks: '5 Garfos', forks_desc: 'Um entre cada par de filósofos', plate: '1 Prato', plate_desc: 'De macarrão para cada filósofo' },
            rules_title: 'Regras',
            rules: { two_forks: '2 Garfos', two_forks_desc: 'Necessários para comer', one_fork_time: '1 Garfo por vez', one_fork_time_desc: 'Por filósofo por vez', finite_time: 'Tempo Finito', finite_time_desc: 'Para comer e pensar' }
          },
          challenges: {
            title: 'Desafios',
            deadlock_title: 'Deadlock',
            deadlock_p: 'Se todos os filósofos pegarem o garfo da esquerda e esperarem pelo da direita, nenhum deles conseguirá comer.',
            deadlock_badges: { circular_wait: 'Bloqueio Circular', infinite_wait: 'Espera Infinita' },
            starvation_title: 'Starvation',
            starvation_p: 'Alguns filósofos podem nunca conseguir comer se a distribuição dos garfos não for justa.',
            starvation_badges: { starvation: 'Inanição', unfairness: 'Injustiça' }
          },
          solutions: {
            title: 'Soluções',
            deadlock_prevention_title: 'Prevenção de Deadlock',
            fork_ordering_label: 'Ordem dos Garfos',
            fork_ordering_desc: 'Sempre pegar o garfo com menor número primeiro',
            timeout_label: 'Timeout',
            timeout_desc: 'Liberar garfos se não conseguir o segundo em tempo',
            starvation_prevention_title: 'Prevenção de Starvation',
            priority_label: 'Prioridade',
            priority_desc: 'Dar prioridade a filósofos que não comeram há mais tempo',
            fairness_label: 'Garantia de Acesso',
            fairness_desc: 'Implementar mecanismos de justiça na distribuição'
          }
        },
        // Added DEADLOCKS page (PT)
        deadlocks: {
          title: 'Deadlocks em Sistemas Distribuídos',
          intro: 'Entenda o que são deadlocks, como eles ocorrem em sistemas distribuídos e as diferentes estratégias para prevenção e detecção.',
          key_concept_label: 'Conceito Chave',
          key_concept_text: 'Deadlocks ocorrem quando dois ou mais processos ficam permanentemente bloqueados, cada um esperando por um recurso que está sendo mantido por outro processo.',
          conditions: {
            title: 'Condições para Deadlock',
            items: {
              mutual_exclusion_title: 'Exclusão Mútua',
              mutual_exclusion_desc: 'Recursos não podem ser compartilhados simultaneamente entre processos.',
              hold_and_wait_title: 'Posse e Espera',
              hold_and_wait_desc: 'Processos mantêm recursos enquanto esperam por outros.',
              no_preemption_title: 'Não Preempção',
              no_preemption_desc: 'Recursos não podem ser forçadamente liberados de um processo.',
              circular_wait_title: 'Espera Circular',
              circular_wait_desc: 'Existe uma cadeia circular de processos esperando por recursos.'
            }
          },
          prevention: {
            title: 'Prevenção de Deadlocks',
            denial_title: 'Prevenção por Negação',
            denial_desc: 'Negar uma das quatro condições necessárias para deadlock.',
            denial_list: [
              'Exclusão Mútua: Permitir compartilhamento de recursos',
              'Posse e Espera: Requerer alocação de todos os recursos de uma vez',
              'Não Preempção: Permitir preempção de recursos',
              'Espera Circular: Impor uma ordem total nos recursos'
            ],
            avoidance_title: 'Prevenção por Evitação',
            avoidance_desc: 'Usar informações sobre o estado do sistema para evitar deadlocks.',
            avoidance_list: [
              'Algoritmo do Banqueiro',
              'Grafo de Alocação de Recursos',
              'Análise de Estado Seguro'
            ]
          },
          detection: {
            title: 'Detecção de Deadlocks',
            centralized_title: 'Detecção Centralizada',
            centralized_desc: 'Um coordenador central monitora o estado do sistema e detecta deadlocks.',
            distributed_title: 'Detecção Distribuída',
            distributed_desc: 'Cada processo participa da detecção através de troca de mensagens.'
          },
          next_steps: {
            title: 'Próximos Passos',
            algorithms_title: 'Algoritmos de Sincronização',
            algorithms_desc: 'Explore algoritmos específicos para prevenção de deadlocks.',
            simulator_title: 'Simulador de Filósofos',
            simulator_desc: 'Experimente diferentes estratégias de prevenção de deadlocks.'
          }
        },
        // Added ALGORITHMS page (PT)
        algorithms: {
          title: 'Algoritmos de Sincronização',
          intro: 'Existem vários algoritmos para garantir a sincronização em sistemas distribuídos. Cada um tem suas características específicas e casos de uso ideais.',
          key_concept_label: 'Conceito Chave',
          key_concept_text: 'A escolha do algoritmo de sincronização depende de fatores como o número de nós, a latência da rede, a tolerância a falhas e os requisitos de performance.',
          bakery: {
            title: 'Algoritmo do Padeiro',
            concept_title: 'Conceito',
            concept_p: 'Baseado na ideia de uma padaria, onde cada cliente recebe um número de senha e é atendido em ordem crescente.',
            badges: { total_order: 'Ordem Total', fairness: 'Justo' },
            demo_title: 'Demo Interativa',
            labels: { process: 'Processo', ticket: 'Senha', request_access: 'Solicitar Acesso' }
          },
          token_ring: {
            title: 'Token Ring',
            concept_title: 'Conceito',
            concept_p: 'Um token circula entre os processos em um anel lógico, e apenas o processo que possui o token pode acessar recursos compartilhados.',
            badges: { single_token: 'Token Único', circular_passing: 'Passagem Circular' },
            demo_title: 'Demo Interativa',
            move_token: 'Mover Token',
            labels: { process_prefix: 'P' }
          },
          ricart_agrawala: {
            title: 'Ricart-Agrawala',
            concept_title: 'Conceito',
            concept_p: 'Baseado em timestamps lógicos, onde processos solicitam permissão de todos os outros processos antes de acessar recursos compartilhados.',
            badges: { timestamps: 'Timestamps', consensus: 'Consenso' },
            demo_title: 'Demo Interativa',
            labels: { process: 'Processo', request_access: 'Solicitar Acesso', ts_prefix: 'TS' }
          },
          comparison: {
            title: 'Comparação',
            bakery_title: 'Algoritmo do Padeiro',
            token_ring_title: 'Token Ring',
            ricart_title: 'Ricart-Agrawala',
            advantages: 'Vantagens',
            disadvantages: 'Desvantagens',
            bakery: { pros: 'Simples e justo', cons: 'Alta complexidade de mensagens' },
            token_ring: { pros: 'Baixa complexidade de mensagens', cons: 'Ponto único de falha' },
            ricart: { pros: 'Robusto a falhas', cons: 'Alta latência' }
          }
        },
        timeout: {
          title: 'Timeout',
          intro: 'Estratégia fundamental para evitar que operações lentas ou travadas prejudiquem a experiência do usuário e a saúde do sistema.',
          how_it_works: {
            title: 'Como Funciona',
            p1: 'Imagine que você está em um restaurante: se o pedido demora, você cancela e vai embora. O Timeout funciona de forma similar.',
            p2: 'Define um tempo máximo para concluir uma operação. Se exceder, o sistema assume problema e interrompe.'
          },
          benefits: {
            title: 'Benefícios',
            items: {
              ux: { title: 'Melhor Experiência do Usuário', desc: 'Evita que usuários fiquem esperando indefinidamente.' },
              freeing_resources: { title: 'Liberação de Recursos', desc: 'Libera recursos que poderiam ficar presos.' },
              failure_prevention: { title: 'Prevenção de Falhas', desc: 'Evita que problemas em um serviço afetem outros.' }
            }
          },
          real_world: {
            title: 'Exemplo do Mundo Real',
            text: 'Ao enviar um formulário, se o servidor estiver lento/indisponível, um timeout de 30s cancela o envio e exibe erro em vez de esperar indefinidamente.'
          },
          best_practices: {
            title: 'Melhores Práticas',
            items: {
              proper_times: { title: 'Tempos Apropriados', desc: 'Defina timeouts realistas conforme operação e expectativa.' },
              clear_messages: { title: 'Mensagens Claras', desc: 'Informe o que ocorreu e o que fazer a seguir.' },
              retry_combo: { title: 'Retry Strategy', desc: 'Combine timeouts com retries para maior resiliência.' }
            }
          },
          cta_simulator: 'Explorar Simulador de Timeout'
        },
        service_oriented: {
          title: 'Design Orientado a Serviços',
          intro: 'Explore as diferentes abordagens de organização de serviços e suas implicações práticas. Cada arquitetura tem seus próprios trade-offs e casos de uso ideais.',
          sections: {
            advantages: 'Vantagens',
            disadvantages: 'Desvantagens',
            example_title: 'Exemplo Prático',
            diagram_title: 'Visualização da Arquitetura',
            legend: { direct_call: 'Chamada direta', interface: 'Interface', api_events: 'API/Eventos' },
            module_labels: { deploy: 'Deploy', communication: 'Comunicação', database: 'Banco' }
          },
          architectures: {
            monolithic: {
              name: 'Monolito',
              description: 'Todas as funcionalidades em um único código base, com acoplamento forte entre módulos.',
              advantages: [
                'Simplicidade de desenvolvimento inicial',
                'Menos sobrecarga em comunicação entre componentes',
                'Deploy único e simples',
                'Mais fácil de testar end-to-end',
                'Compartilhamento de recursos eficiente'
              ],
              disadvantages: [
                'Difícil de escalar partes específicas do sistema',
                'Qualquer mudança exige redistribuição completa',
                'Pode se tornar complexo com o crescimento',
                'Alto acoplamento entre módulos',
                'Difícil manutenção em times grandes'
              ],
              example: 'Um aplicativo simples de e-commerce onde catálogo, usuários e pedidos estão em um único código base.',
              modules: {
                auth: { name: 'Autenticação', details: { deployment: 'Deploy único para toda a aplicação', communication: 'Chamadas de função diretas', database: 'Banco de dados compartilhado' } },
                orders: { name: 'Pedidos', details: { deployment: 'Deploy único para toda a aplicação', communication: 'Chamadas de função diretas', database: 'Banco de dados compartilhado' } },
                users: { name: 'Usuários', details: { deployment: 'Deploy único para toda a aplicação', communication: 'Chamadas de função diretas', database: 'Banco de dados compartilhado' } }
              }
            },
            modular: {
              name: 'Monolito Modular',
              description: 'Código organizado em módulos bem definidos com limites claros, mas ainda em um único deploy.',
              advantages: [
                'Código bem organizado e modular com limites claros',
                'Facilidade de migração para microsserviços no futuro',
                'Menor complexidade operacional que microsserviços',
                'Bom equilíbrio entre simplicidade e organização',
                'Permite evolução gradual da arquitetura'
              ],
              disadvantages: [
                'Ainda requer disciplina para manter os limites entre módulos',
                'Escalabilidade ainda limitada por ser uma única unidade',
                'Necessidade de coordenação entre times',
                'Pode haver tentação de quebrar os limites dos módulos',
                'Deploy ainda é acoplado'
              ],
              example: 'Um e-commerce com o código dividido em módulos independentes (catálogo, pedidos, usuários), com regras/dados próprios, porém implantados juntos como uma única aplicação.',
              modules: {
                auth: { name: 'Módulo de Autenticação', details: { deployment: 'Deploy único, mas módulos independentes', communication: 'Interfaces bem definidas', database: 'Schema separado no banco compartilhado' } },
                orders: { name: 'Módulo de Pedidos', details: { deployment: 'Deploy único, mas módulos independentes', communication: 'Interfaces bem definidas', database: 'Schema separado no banco compartilhado' } },
                users: { name: 'Módulo de Usuários', details: { deployment: 'Deploy único, mas módulos independentes', communication: 'Interfaces bem definidas', database: 'Schema separado no banco compartilhado' } }
              }
            },
            microservices: {
              name: 'Microsserviços',
              description: 'Serviços independentes que se comunicam via rede, cada um com seu próprio deploy e banco de dados.',
              advantages: [
                'Flexibilidade para escalar partes específicas do sistema',
                'Maior modularidade e facilidade de manutenção',
                'Cada equipe pode se concentrar em um único serviço',
                'Liberdade tecnológica por serviço',
                'Deploys independentes e mais rápidos'
              ],
              disadvantages: [
                'Complexidade aumentada na orquestração',
                'Requer infraestrutura robusta',
                'Desafios de consistência de dados',
                'Maior latência na comunicação',
                'Custos operacionais mais altos'
              ],
              example: 'Um e-commerce onde pagamento, inventário e usuários são implementados como microsserviços separados.',
              modules: {
                auth: { name: 'Auth Service', details: { deployment: 'Deploy independente', communication: 'API REST/gRPC', database: 'Banco de dados próprio' } },
                orders: { name: 'Orders Service', details: { deployment: 'Deploy independente', communication: 'API REST/gRPC', database: 'Banco de dados próprio' } },
                users: { name: 'Users Service', details: { deployment: 'Deploy independente', communication: 'API REST/gRPC', database: 'Banco de dados próprio' } }
              }
            }
          }
        },
        coupling: {
          title: 'Acoplamento em Sistemas Distribuídos',
          intro: 'O acoplamento mede quão conectados/ dependentes são os componentes. Em sistemas distribuídos, seu tipo e nível impactam flexibilidade, manutenibilidade e resiliência.',
          key_concept_label: 'Conceito Chave',
          key_concept_text: 'Quanto menor o acoplamento, maior a flexibilidade e manutenção — mas acoplamento extremamente baixo pode aumentar a complexidade. Equilíbrio é essencial.',
          types_title: 'Tipos de Acoplamento',
          static_title: 'Acoplamento Estático',
          characteristics_title: 'Características',
          advantages_title: 'Vantagens',
          disadvantages_title: 'Desvantagens',
          example_static_title: 'Exemplo de Acoplamento Estático',
          dynamic_title: 'Acoplamento Dinâmico',
          example_dynamic_title: 'Exemplo de Acoplamento Dinâmico',
          service_discovery_title: 'Service Discovery',
          service_discovery_intro: 'Service Discovery é um padrão fundamental para acoplamento dinâmico em sistemas distribuídos. Permite que serviços se encontrem e se comuniquem sem conhecimento prévio de localizações.',
          components_title: 'Componentes Principais',
          components: { registry: 'Registro de Serviços', health: 'Health Checking', dns: 'DNS Dinâmico' },
          tools_title: 'Ferramentas Populares',
          best_practices_title: 'Melhores Práticas',
          design_arch_title: 'Design e Arquitetura',
          implementation_title: 'Implementação',
          tradeoffs_title: 'Trade-offs e Considerações',
          real_world_title: 'Exemplos do Mundo Real'
        },
        orchestration_vs_choreography: {
          title: 'Orquestração vs Coreografia',
          intro: 'Entenda as diferenças entre os padrões de Orquestração e Coreografia em sistemas distribuídos.',
          overview_title: 'Visão Geral',
          orchestration_title: 'Orquestração',
          orchestration_p: 'A central orchestrator controls the workflow, coordinating interactions between services. Like a conductor, it dictates what each service should do and when.',
          choreography_title: 'Coreografia',
          choreography_p: 'Services interact independently by reacting to events without a central controller. Like a dance, each participant knows their steps and reacts to others.',
          comparison_title: 'Comparação Detalhada',
          examples_title: 'Exemplos de Uso',
          when_to_use_title: 'Quando Usar Cada Padrão',
          use_orchestration_when: 'Use Orquestração Quando:',
          use_choreography_when: 'Use Coreografia Quando:',
          points_orchestration: [
            'Controlador central (orquestrador)',
            'Fluxo de trabalho explícito',
            'Mais fácil de entender e depurar',
            'Menos flexível para mudanças',
            'Ponto único de falha',
            'Maior acoplamento'
          ],
          points_choreography: [
            'Sem controlador central',
            'Fluxo de trabalho implícito',
            'Mais difícil de entender',
            'Mais flexível para mudanças',
            'Sem ponto único de falha',
            'Menor acoplamento'
          ],
          use_orchestration_when_list: [
            'O fluxo de trabalho é complexo e precisa de coordenação central',
            'Você precisa de visibilidade clara do processo',
            'O processo é estável e raramente muda',
            'Você precisa de controle total sobre o fluxo',
            'O processo é sequencial e dependente'
          ],
          use_choreography_when_list: [
            'Os serviços são independentes e podem evoluir separadamente',
            'Você precisa de alta escalabilidade',
            'O processo é dinâmico e muda frequentemente',
            'Você quer reduzir o acoplamento entre serviços',
            'Os eventos podem ser processados em paralelo'
          ],
          examples: {
            orchestration_order_processing: 'Processamento de Pedidos',
            choreography_notification_system: 'Sistema de Notificações'
          },
          labels: {
            orchestrator: 'Orquestrador',
            service_a: 'Serviço A',
            service_b: 'Serviço B',
            service_c: 'Serviço C',
            service_d: 'Serviço D',
            start: 'Início',
            process: 'Processo',
            end: 'Fim',
            order_created: 'Pedido Criado',
            email: 'Email',
            sms: 'SMS',
            analytics: 'Análises',
            logs: 'Logs'
          }
        },

      },
      canary_deployment: {
        title: 'Canary Deployment',
        intro: 'Uma estratégia de deployment progressivo que reduz riscos expondo gradualmente uma nova versão a uma pequena porcentagem de usuários antes de liberar para todos.',
        how_it_works: {
          title: 'Como Funciona',
          text: 'O canary deployment funciona roteando uma pequena porcentagem do tráfego de produção para a nova versão enquanto a maioria continua usando a versão estável. Isso permite que as equipes monitorem o comportamento real e detectem problemas antes que afetem todos os usuários.'
        },
        origin: {
          title: 'Origem do Nome',
          text: 'O nome vem da prática de mineradores de carvão que levavam canários para as minas. Se gases perigosos estivessem presentes, o canário seria afetado primeiro, alertando os mineradores. Da mesma forma, canary deployments detectam problemas cedo com impacto mínimo.'
        },
        diagram: {
          users: 'Usuários',
          router: 'Roteador'
        },
        phases: {
          title: 'Fases do Deployment',
          deploy: {
            title: 'Deploy do Canary',
            desc: 'Faça deploy da nova versão junto com a versão estável existente, sem rotear tráfego para ela ainda.'
          },
          route: {
            title: 'Rotear Tráfego',
            desc: 'Comece a rotear uma pequena porcentagem (ex: 5-10%) do tráfego para a versão canary.'
          },
          monitor: {
            title: 'Monitorar e Analisar',
            desc: 'Monitore métricas chave como taxas de erro, latência e KPIs de negócio. Compare o desempenho canary vs estável.'
          },
          expand: {
            title: 'Expandir ou Rollback',
            desc: 'Se as métricas estiverem saudáveis, aumente gradualmente o tráfego canary. Se problemas forem detectados, faça rollback imediatamente.'
          }
        },
        benefits: {
          title: 'Benefícios',
          items: {
            risk_reduction: {
              title: 'Risco Reduzido',
              desc: 'Problemas afetam apenas uma pequena porcentagem de usuários, minimizando o raio de explosão.'
            },
            quick_rollback: {
              title: 'Rollback Rápido',
              desc: 'Problemas podem ser detectados e revertidos antes de impactar todos os usuários.'
            },
            real_testing: {
              title: 'Teste no Mundo Real',
              desc: 'Teste com tráfego de produção real e comportamento de usuários, não apenas testes sintéticos.'
            },
            gradual_rollout: {
              title: 'Confiança Gradual',
              desc: 'Construa confiança no release aumentando progressivamente a exposição.'
            }
          }
        },
        challenges: {
          title: 'Desafios',
          items: {
            complexity: {
              title: 'Complexidade de Infraestrutura',
              desc: 'Requer roteamento de tráfego sofisticado, balanceamento de carga e automação de deployment.'
            },
            monitoring: {
              title: 'Requisitos de Monitoramento',
              desc: 'Necessita de observabilidade robusta para comparar versões canary e estável efetivamente.'
            },
            db_compat: {
              title: 'Compatibilidade de Banco de Dados',
              desc: 'Mudanças de schema devem ser retrocompatíveis já que ambas versões rodam simultaneamente.'
            }
          }
        },
        vs_blue_green: {
          title: 'Canary vs Blue-Green',
          aspect: 'Aspecto',
          canary: 'Canary',
          blue_green: 'Blue-Green',
          traffic: 'Tráfego',
          traffic_canary: 'Gradual',
          traffic_bg: 'Tudo de uma vez',
          risk: 'Risco',
          risk_canary: 'Menor',
          risk_bg: 'Maior',
          rollback: 'Rollback',
          rollback_canary: 'Instantâneo',
          rollback_bg: 'Instantâneo'
        },
        cta_simulator: 'Explorar Simulador Canary'
      },
      monitoring_maintenance: {
        main: {
          title: 'Monitoramento e Manutenção de Sistemas Distribuídos',
          intro_p1: 'O monitoramento e manutenção são aspectos críticos para garantir a saúde, performance e confiabilidade de sistemas distribuídos. Uma estratégia eficaz combina diferentes aspectos de observabilidade com práticas proativas de manutenção.',
          key_concept_label: 'Conceito Chave',
          key_concept_text: 'A observabilidade em sistemas distribuídos é construída sobre três pilares fundamentais: métricas, logs e traces. Juntos, eles fornecem uma visão completa do estado e comportamento do sistema.',
          pillars_title: 'Os Três Pilares da Observabilidade',
          pillars: {
            metrics: {
              title: 'Métricas',
              items: ['Dados numéricos ao longo do tempo', 'CPU, memória, latência, throughput', 'Agregações e tendências', 'Base para alertas e dashboards']
            },
            logs: {
              title: 'Logs',
              items: ['Registros de eventos', 'Debugging e auditoria', 'Contexto detalhado', 'Histórico de ações']
            },
            traces: {
              title: 'Traces',
              items: ['Fluxo de requisições', 'Dependências entre serviços', 'Performance end-to-end', 'Diagnóstico de problemas']
            }
          },
          golden_signals_title: 'Métricas Essenciais (Golden Signals)',
          use_method_title: 'Método USE',
          use_method_p: 'Utilization, Saturation, and Errors - um método para análise de performance de recursos.',
          use_method_items: [
            { title: 'Utilização', desc: 'Percentual de tempo que o recurso está ocupado' },
            { title: 'Saturação', desc: 'Grau de sobrecarga do recurso' },
            { title: 'Erros', desc: 'Taxa de falhas do recurso' }
          ],
          red_method_title: 'Método RED',
          red_method_p: 'Rate, Errors, and Duration - focado em métricas de requisições e serviços.',
          red_method_items: [
            { title: 'Taxa (Rate)', desc: 'Número de requisições por segundo' },
            { title: 'Erros (Errors)', desc: 'Taxa de falhas nas requisições' },
            { title: 'Duração (Duration)', desc: 'Tempo de resposta das requisições' }
          ],
          tools_title: 'Ferramentas de Monitoramento',
          tools: {
            metrics_title: 'Métricas',
            metrics_items: [
              { name: 'Prometheus', desc: 'Coleta e armazenamento de métricas' },
              { name: 'Grafana', desc: 'Visualização e dashboards' },
              { name: 'Datadog', desc: 'Monitoramento como serviço' }
            ],
            logs_title: 'Logs',
            logs_items: [
              { name: 'ELK Stack', desc: 'Elasticsearch, Logstash, Kibana' },
              { name: 'Graylog', desc: 'Gerenciamento centralizado de logs' },
              { name: 'Splunk', desc: 'Análise avançada de logs' }
            ],
            tracing_title: 'Tracing',
            tracing_items: [
              { name: 'Jaeger', desc: 'Tracing distribuído de código aberto' },
              { name: 'Zipkin', desc: 'Rastreamento de latência' },
              { name: 'New Relic', desc: 'APM e tracing como serviço' }
            ]
          },
          best_practices_title: 'Melhores Práticas',
          monitoring_title: 'Monitoramento',
          monitoring_items: [
            { title: 'Monitoramento Proativo', desc: 'Identifique problemas antes que afetem os usuários' },
            { title: 'Alertas Significativos', desc: 'Configure alertas que realmente importam' },
            { title: 'Automação', desc: 'Automatize respostas para problemas comuns' }
          ],
          maintenance_title: 'Manutenção',
          maintenance_items: [
            { title: 'Manutenção Preventiva', desc: 'Agende manutenções regulares' },
            { title: 'Documentação', desc: 'Mantenha documentação atualizada' },
            { title: 'Backup e Recuperação', desc: 'Implemente e teste planos de recuperação' }
          ],
          slo_title: 'Objetivos de Nível de Serviço',
          sli_card: { title: 'SLI', desc: 'Service Level Indicator', items: ['Métricas específicas', 'Latência', 'Disponibilidade', 'Taxa de erros'] },
          slo_card: { title: 'SLO', desc: 'Service Level Objective', items: ['Metas para SLIs', '99.9% uptime', 'Latência < 200ms', 'Error rate < 0.1%'] },
          sla_card: { title: 'SLA', desc: 'Service Level Agreement', items: ['Contrato formal', 'Consequências', 'Compensações', 'Garantias'] }
        },
        metrics: {
          title: 'Métricas e KPIs em Sistemas Distribuídos',
          intro_p1: 'Métricas e KPIs (Key Performance Indicators) são fundamentais para entender o comportamento, performance e saúde de sistemas distribuídos. Elas fornecem insights quantitativos que permitem tomar decisões baseadas em dados.',
          key_concept_label: 'Conceito Chave',
          key_concept_text: 'Métricas efetivas devem ser SMART: Específicas, Mensuráveis, Atingíveis, Relevantes e Temporais.',
          categories_title: 'Categorias de Métricas Essenciais',
          categories: {
            system_title: 'Métricas de Sistema',
            system_items: [
              { title: 'Utilização de CPU', desc: 'Percentual de uso do processador por serviço' },
              { title: 'Uso de Memória', desc: 'Consumo de RAM e memória virtual' },
              { title: 'I/O de Disco', desc: 'Taxa de leitura/escrita e latência de disco' }
            ],
            app_title: 'Métricas de Aplicação',
            app_items: [
              { title: 'Throughput', desc: 'Requisições processadas por segundo' },
              { title: 'Latência', desc: 'Tempo de resposta das requisições' },
              { title: 'Taxa de Erros', desc: 'Percentual de requisições com falha' }
            ]
          },
          perf_title: 'Métricas de Performance',
          latency_card: {
            title: 'Latência',
            percentiles_title: 'Percentis',
            percentiles_items: ['P50 (Mediana): < 100ms', 'P90: < 200ms', 'P99: < 500ms'],
            components_title: 'Componentes',
            components_items: ['Network Time', 'Processing Time', 'Queue Time']
          },
          throughput_card: {
            title: 'Throughput',
            measures_title: 'Medidas',
            measures_items: ['RPS (Requests per Second)', 'TPS (Transactions per Second)', 'QPS (Queries per Second)'],
            capacity_title: 'Capacidade',
            capacity_items: ['Peak Load', 'Sustained Load', 'Burst Capacity']
          },
          business_kpis_title: 'KPIs de Negócio',
          availability_card: { title: 'Disponibilidade', items: ['Uptime', 'MTBF (Mean Time Between Failures)', 'MTTR (Mean Time To Recovery)', 'Error Budget'] },
          quality_card: { title: 'Qualidade', items: ['Success Rate', 'Error Rate', 'Data Quality', 'User Satisfaction'] },
          cost_card: { title: 'Custo', items: ['Infrastructure Cost', 'Cost per Request', 'Resource Utilization', 'ROI'] },
          prom_title: 'Implementação com Prometheus',
          prom_desc: 'Exemplo de configuração de métricas usando Prometheus e sua linguagem de consulta PromQL:',
          prom_outro: 'Estas métricas podem ser visualizadas em dashboards do Grafana para monitoramento em tempo real.',
          best_practices_title: 'Melhores Práticas',
          collect_title: 'Coleta de Métricas',
          collect_items: [{ title: 'Padronização', desc: 'Use convenções de nomenclatura consistentes' }, { title: 'Granularidade', desc: 'Equilibre detalhamento e overhead' }, { title: 'Agregação', desc: 'Defina períodos adequados de agregação' }],
          viz_title: 'Visualização',
          viz_items: [{ title: 'Dashboards', desc: 'Organize métricas relacionadas' }, { title: 'Alertas', desc: 'Configure thresholds significativos' }, { title: 'Correlação', desc: 'Relacione métricas para análise' }]
        },
        logs: {
          title: 'Logs e Tracing em Sistemas Distribuídos',
          intro_p1: 'Logs e tracing são fundamentais para entender o comportamento, debugar problemas e manter a observabilidade em sistemas distribuídos. Eles fornecem insights detalhados sobre o fluxo de execução e o estado do sistema.',
          key_concept_label: 'Conceito Chave',
          key_concept_text: 'Em sistemas distribuídos, logs devem ser tratados como streams de eventos, centralizados e correlacionados para fornecer uma visão completa do sistema.',
          types_title: 'Tipos de Logs',
          app_logs_title: 'Logs de Aplicação',
          app_logs_items: ['Eventos de negócio', 'Fluxo de execução', 'Erros e exceções', 'Ações do usuário'],
          sys_logs_title: 'Logs de Sistema',
          sys_logs_items: ['Inicialização/shutdown', 'Uso de recursos', 'Eventos de sistema', 'Problemas de hardware'],
          sec_logs_title: 'Logs de Segurança',
          sec_logs_items: ['Tentativas de acesso', 'Alterações de permissão', 'Eventos de auditoria', 'Alertas de segurança'],
          structured_title: 'Logging Estruturado',
          structured_desc: 'Logging estruturado trata logs como objetos de dados em vez de texto simples, facilitando a análise e a busca.',
          benefits_title: 'Benefícios',
          benefits_items: [{ title: 'Pesquisabilidade', desc: 'Facilita buscas e filtros complexos' }, { title: 'Análise', desc: 'Permite agregações e visualizações' }, { title: 'Padronização', desc: 'Formato consistente entre serviços' }],
          example_title: 'Exemplo',
          aggregation_title: 'Agregação de Logs',
          components_title: 'Componentes',
          components_items: [{ title: 'Coletores', desc: 'Agentes que coletam logs de diferentes fontes' }, { title: 'Processadores', desc: 'Filtram, transformam e enriquecem logs' }, { title: 'Armazenamento', desc: 'Sistema distribuído para persistência' }, { title: 'Interface', desc: 'UI para busca e análise' }],
          elk_title: 'Stack ELK',
          elk_items: [{ title: 'Elasticsearch', desc: 'Armazenamento e busca distribuída de logs' }, { title: 'Logstash', desc: 'Pipeline de processamento de logs' }, { title: 'Kibana', desc: 'Visualização e análise de logs' }],
          tracing_title: 'Tracing Distribuído',
          tracing_desc: 'Tracing distribuído permite rastrear o fluxo de uma requisição por múltiplos serviços, fornecendo visibilidade end-to-end.',
          concepts_title: 'Conceitos',
          concepts_items: [{ title: 'Trace', desc: 'Representa uma transação end-to-end' }, { title: 'Span', desc: 'Unidade de trabalho dentro de um trace' }, { title: 'Context', desc: 'Metadados que acompanham o trace' }],
          tools_title: 'Ferramentas',
          tools_items: [{ title: 'Jaeger', desc: 'Sistema de tracing distribuído de código aberto' }, { title: 'Zipkin', desc: 'Focado em latência e análise de dependências' }, { title: 'OpenTelemetry', desc: 'Padrão aberto para instrumentação' }],
          best_practices_title: 'Melhores Práticas',
          logging_title: 'Logging',
          logging_items: [{ title: 'Níveis Apropriados', desc: 'Use níveis adequadamente (ERROR, WARN, INFO, DEBUG)' }, { title: 'Contexto', desc: 'Inclua informações relevantes para debugging' }, { title: 'Sensibilidade', desc: 'Evite dados sensíveis nos logs' }],
          tracing_bp_title: 'Tracing',
          tracing_bp_items: [{ title: 'Amostragem', desc: 'Configure taxas de amostragem adequadas' }, { title: 'Instrumentação', desc: 'Use bibliotecas padrão de instrumentação' }, { title: 'Correlação', desc: 'Mantenha correlação entre logs e traces' }]
        },
        logs_page: {
          title: 'Logs e Tracing em Sistemas Distribuídos',
          intro_p1: 'Em sistemas distribuídos, logs e tracing são fundamentais para monitoramento, debugging e análise de performance. Esta seção explora as melhores práticas e ferramentas para implementar um sistema robusto de observabilidade.',
          buttons: { logs_simulator: 'Simulador de Logs', tracing_simulator: 'Simulador de Tracing' },
          levels_title: 'Níveis de Log',
          levels: { debug_desc: 'Informações detalhadas para debugging', info_desc: 'Eventos normais do sistema', warn_desc: 'Avisos sobre situações inesperadas', error_desc: 'Erros que precisam de atenção' },
          formats: {
            text_title: 'Logs em Texto Puro',
            text_adv_title: 'Vantagens',
            text_adv_items: ['Fácil de ler para humanos', 'Menor overhead de processamento', 'Compatível com ferramentas legadas', 'Menor tamanho de arquivo'],
            text_disadv_title: 'Desvantagens',
            text_disadv_items: ['Difícil de parsear programaticamente', 'Falta de estrutura clara', 'Difícil de adicionar metadados', 'Propenso a erros de formatação'],
            json_title: 'Logs em JSON',
            json_adv_title: 'Vantagens',
            json_adv_items: ['Estrutura clara e consistente', 'Fácil de parsear e processar', 'Suporte a metadados complexos', 'Melhor para análise automatizada'],
            json_disadv_title: 'Desvantagens',
            json_disadv_items: ['Maior overhead de processamento', 'Arquivos de log maiores', 'Menos legível para humanos', 'Pode ser excessivo para logs simples']
          },
          tracing_section: {
            title: 'Distributed Tracing',
            what_is_title: 'O que é Tracing?',
            what_is_p: 'Tracing é uma técnica que permite rastrear o fluxo de uma requisição através de múltiplos serviços em um sistema distribuído. Cada requisição recebe um ID único (traceId) que é propagado entre os serviços.',
            components_title: 'Componentes Principais',
            components_items: ['TraceId: Identificador único da requisição', 'SpanId: Identificador de cada operação', 'ParentSpanId: Relacionamento entre operações', 'Tags: Metadados adicionais', 'Timestamps: Duração das operações'],
            benefits_title: 'Benefícios',
            benefits_items: ['Visualização do fluxo de requisições', 'Identificação de gargalos', 'Debugging em sistemas distribuídos', 'Análise de performance', 'Correlação de eventos']
          },
          best_practices: {
            title: 'Boas Práticas',
            logging_title: 'Logging',
            logging_items: ['Use níveis de log apropriados', 'Inclua contexto relevante', 'Mantenha formato consistente', 'Evite logs sensíveis', 'Use IDs de correlação', 'Inclua timestamps', 'Estruture os metadados', 'Implemente rotação de logs'],
            tracing_title: 'Tracing',
            tracing_items: ['Propague traceId entre serviços', 'Use spans para operações importantes', 'Adicione tags relevantes', 'Mantenha spans concisos', 'Implemente sampling', 'Configure retenção adequada', 'Integre com ferramentas de análise', 'Monitore overhead de tracing']
          },
          tools: {
            title: 'Ferramentas Populares',
            logging_title: 'Logging',
            logging_items: ['ELK Stack (Elasticsearch, Logstash, Kibana)', 'Graylog', 'Loki', 'Datadog', 'New Relic', 'Splunk'],
            tracing_title: 'Tracing',
            tracing_items: ['Jaeger', 'Zipkin', 'OpenTelemetry', 'Datadog APM', 'New Relic APM', 'Lightstep']
          }
        },
        logs_simulator: {
          title: 'Simulador de Logs',
          intro: 'Explore como configurar e analisar logs em sistemas distribuídos. Este simulador demonstra boas e más práticas de logging.',
          actions: {
            settings: 'Configurações',
            reset: 'Reiniciar'
          },
          settings_title: 'Configurações',
          settings: {
            auto_advance: 'Avanço Automático',
            delay_label: 'Delay entre Eventos ({{ms}}ms)'
          },
          controls: {
            info_title: 'INFO',
            add_good_info: 'Adicionar INFO Bom',
            add_bad_info: 'Adicionar INFO Ruim',
            warn_title: 'WARN',
            add_good_warn: 'Adicionar WARN Bom',
            add_bad_warn: 'Adicionar WARN Ruim',
            error_title: 'ERROR',
            add_good_error: 'Adicionar ERROR Bom',
            add_bad_error: 'Adicionar ERROR Ruim'
          },
          viewer_title: 'Visualizador de Logs',
          badges: {
            good: 'Bom',
            bad: 'Ruim'
          },
          best_practices_title: 'Boas Práticas',
          best_practices_items: [
            'Use logs estruturados (formato JSON)',
            'Inclua IDs de correlação (traceId, spanId)',
            'Adicione informações contextuais',
            'Use níveis de log apropriados',
            'Inclua timestamps',
            'Identifique o serviço/componente',
            'Inclua metadados relevantes',
            'Mantenha formato consistente'
          ],
          bad_practices_title: 'Más Práticas',
          bad_practices_items: [
            'Logar informações sensíveis',
            'Usar formatos inconsistentes',
            'Logar sem contexto',
            'Usar níveis de log inadequados',
            'Logar informações excessivas',
            'Usar texto não estruturado',
            'Logar sem timestamps',
            'Misturar diferentes padrões'
          ]
        },
        tracing_simulator: {
          title: 'Simulador de Tracing',
          intro: 'Explore conceitos de distributed tracing e entenda como requisições fluem através de múltiplos serviços.',
          controls_title: 'Controles',
          controls: {
            clear: 'Limpar',
            start_request: 'Iniciar Requisição',
            add_span: 'Adicionar Span',
            finish_request: 'Finalizar Requisição'
          },
          current_request_title: 'Requisição Atual',
          trace_id_label: 'TraceId',
          steps_label: 'Passo {{current}} de {{total}}',
          timeline_label: 'Timeline',
          history_title: 'Histórico de Traces',
          error_badge: 'Erro'
        },
        alerts: {
          title: 'Alertas e Notificações em Sistemas Distribuídos',
          intro_p1: 'Um sistema eficaz de alertas e notificações é crucial para manter a saúde e disponibilidade de sistemas distribuídos. Ele permite identificar e responder rapidamente a problemas antes que afetem significativamente os usuários.',
          key_concept_label: 'Conceito Chave',
          key_concept_text: 'Alertas devem ser acionáveis, relevantes e evitar fadiga de alertas. Um bom sistema de alertas diferencia entre situações críticas que exigem ação imediata e condições que podem ser tratadas durante o horário normal de trabalho.',
          types_title: 'Tipos de Alertas',
          types: {
            critical: {
              title: 'Críticos',
              items: ['Indisponibilidade de serviço', 'Falhas de segurança', 'Perda de dados', 'Violações de SLA']
            },
            warning: {
              title: 'Avisos',
              items: ['Alta utilização de recursos', 'Degradação de performance', 'Tendências anômalas', 'Erros não críticos']
            },
            info: {
              title: 'Informativos',
              items: ['Deploys realizados', 'Manutenções programadas', 'Mudanças de configuração', 'Eventos de rotina']
            }
          },
          config_title: 'Configuração de Alertas',
          thresholds_title: 'Thresholds',
          static_title: 'Estáticos',
          static_items: ['CPU > 80%', 'Memória > 90%', 'Latência > 500ms', 'Error rate > 1%'],
          dynamic_title: 'Dinâmicos',
          dynamic_items: ['Baseados em histórico', 'Machine learning', 'Análise de tendências', 'Sazonalidade'],
          example_title: 'Exemplo de Configuração',
          channels_title: 'Canais de Notificação',
          sync_title: 'Síncronos',
          sync_channels: {
            sms: { title: 'SMS', desc: 'Para alertas críticos que exigem ação imediata' },
            calls: { title: 'Ligações', desc: 'Para escalação de incidentes críticos' },
            pagerduty: { title: 'PagerDuty', desc: 'Gestão de plantão e escalação' }
          },
          async_title: 'Assíncronos',
          async_channels: {
            email: { title: 'Email', desc: 'Para notificações não urgentes e relatórios' },
            slack: { title: 'Slack', desc: 'Para comunicação em equipe e discussões' },
            dashboards: { title: 'Dashboards', desc: 'Para visualização e histórico de alertas' }
          },
          incident_title: 'Gestão de Incidentes',
          process_title: 'Processo',
          process_steps: {
            detection: { title: 'Detecção', desc: 'Identificação do problema através de alertas' },
            response: { title: 'Resposta', desc: 'Acionamento da equipe responsável' },
            mitigation: { title: 'Mitigação', desc: 'Ações para resolver o problema' },
            resolution: { title: 'Resolução', desc: 'Correção definitiva e documentação' }
          },
          tools_title: 'Ferramentas',
          tools: {
            pagerduty: { title: 'PagerDuty', desc: 'Gestão de plantão e escalação de incidentes' },
            opsgenie: { title: 'OpsGenie', desc: 'Alertas e coordenação de resposta a incidentes' },
            servicenow: { title: 'ServiceNow', desc: 'ITSM e gestão do ciclo de vida de incidentes' }
          },
          best_practices_title: 'Melhores Práticas',
          alert_config_title: 'Configuração de Alertas',
          alert_practices: {
            actionable: { title: 'Alertas Acionáveis', desc: 'Configure apenas alertas que exigem ação' },
            noise_reduction: { title: 'Redução de Ruído', desc: 'Evite alertas duplicados ou desnecessários' },
            context: { title: 'Contexto', desc: 'Forneça informações suficientes para diagnóstico' }
          },
          incident_response_title: 'Resposta a Incidentes',
          response_practices: {
            playbooks: { title: 'Playbooks', desc: 'Mantenha procedimentos documentados' },
            escalation: { title: 'Escalação', desc: 'Defina níveis claros de escalação' },
            postmortem: { title: 'Postmortem', desc: 'Realize análise após incidentes' }
          }
        },
        performance: {
          title: 'Análise de Performance em Sistemas Distribuídos',
          intro_p1: 'A análise de performance é fundamental para garantir que sistemas distribuídos atendam seus requisitos de desempenho e escalabilidade. Uma abordagem sistemática para medição, análise e otimização é essencial.',
          key_concept_label: 'Conceito Chave',
          key_concept_text: 'Performance em sistemas distribuídos é multidimensional, envolvendo latência, throughput, utilização de recursos e escalabilidade. A otimização de um aspecto frequentemente impacta outros.',
          metrics_title: 'Métricas de Performance',
          core_metrics_title: 'Métricas Principais',
          core_metrics: {
            latency: { title: 'Latência', desc: 'Tempo de resposta para requisições' },
            throughput: { title: 'Throughput', desc: 'Requisições processadas por segundo' },
            utilization: { title: 'Utilização', desc: 'Uso de recursos do sistema' }
          },
          advanced_metrics_title: 'Métricas Avançadas',
          advanced_metrics: {
            apdex: { title: 'Apdex', desc: 'Índice de satisfação do usuário' },
            percentiles: { title: 'Percentis', desc: 'P95, P99 de latência' },
            saturation: { title: 'Saturação', desc: 'Ponto de sobrecarga do sistema' }
          },
          testing_title: 'Testes de Performance',
          testing_types: {
            load: {
              title: 'Teste de Carga',
              items: ['Comportamento sob carga normal', 'Tempos de resposta médios', 'Uso de recursos', 'Throughput sustentado']
            },
            stress: {
              title: 'Teste de Stress',
              items: ['Limites do sistema', 'Comportamento sob sobrecarga', 'Pontos de falha', 'Recuperação após falha']
            },
            scalability: {
              title: 'Teste de Escalabilidade',
              items: ['Capacidade de crescimento', 'Elasticidade', 'Custos de escala', 'Limites de recursos']
            }
          },
          tools_title: 'Ferramentas de Performance',
          monitoring_title: 'Monitoramento',
          apm_tools_title: 'APM Tools',
          apm_tools: ['New Relic', 'Datadog', 'Dynatrace', 'AppDynamics'],
          profiling_title: 'Profiling',
          profiling_tools: ['JProfiler', 'YourKit', 'pprof', 'async-profiler'],
          load_testing_title: 'Teste de Carga',
          open_source_title: 'Ferramentas Open Source',
          open_source_tools: ['Apache JMeter', 'Gatling', 'k6', 'Locust'],
          cloud_services_title: 'Serviços em Nuvem',
          cloud_services: ['BlazeMeter', 'Flood.io', 'LoadRunner Cloud', 'AWS Load Testing'],
          optimization_title: 'Otimização de Performance',
          strategies_title: 'Estratégias',
          strategies: {
            caching: { title: 'Caching', desc: 'Implementação de diferentes níveis de cache' },
            load_balancing: { title: 'Load Balancing', desc: 'Distribuição eficiente de carga' },
            code_optimization: { title: 'Otimização de Código', desc: 'Melhoria de algoritmos e estruturas de dados' }
          },
          techniques_title: 'Técnicas',
          techniques: {
            lazy_loading: { title: 'Lazy Loading', desc: 'Carregamento sob demanda de recursos' },
            connection_pooling: { title: 'Connection Pooling', desc: 'Reutilização de conexões' },
            async_processing: { title: 'Asynchronous Processing', desc: 'Processamento não bloqueante' }
          },
          best_practices_title: 'Melhores Práticas',
          development_title: 'Desenvolvimento',
          development_practices: {
            continuous_profiling: { title: 'Profiling Contínuo', desc: 'Monitore performance durante o desenvolvimento' },
            load_tests: { title: 'Testes de Carga', desc: 'Inclua testes de performance no CI/CD' },
            benchmarking: { title: 'Benchmarking', desc: 'Compare performance entre versões' }
          },
          production_title: 'Produção',
          production_practices: {
            realtime_monitoring: { title: 'Monitoramento Real-Time', desc: 'Acompanhe métricas em tempo real' },
            capacity_planning: { title: 'Capacity Planning', desc: 'Planeje recursos com antecedência' },
            continuous_optimization: { title: 'Otimização Contínua', desc: 'Melhore com base em dados reais' }
          }
        },
        health_checks: {
          title: 'Health Checks em Sistemas Distribuídos',
          intro_p1: 'Health checks são fundamentais para monitorar a saúde e disponibilidade de serviços em sistemas distribuídos. Eles permitem detecção proativa de problemas, facilitam o balanceamento de carga e auxiliam em estratégias de recuperação.',
          key_concept_label: 'Conceito Chave',
          key_concept_text: 'Um bom sistema de health check deve ser abrangente, verificando não apenas se o serviço está respondendo, mas também sua capacidade de realizar suas funções essenciais e acessar recursos necessários.',
          types_title: 'Tipos de Health Checks',
          types: {
            liveness: {
              title: 'Liveness',
              items: ['Verifica se o serviço está vivo', 'Detecta deadlocks', 'Monitora processos', 'Reinicia em caso de falha']
            },
            readiness: {
              title: 'Readiness',
              items: ['Verifica disponibilidade', 'Conexões com dependências', 'Estado de recursos', 'Controle de tráfego']
            },
            startup: {
              title: 'Startup',
              items: ['Inicialização do serviço', 'Carregamento de recursos', 'Configuração inicial', 'Warm-up period']
            }
          },
          patterns_title: 'Padrões de Implementação',
          http_endpoints_title: 'Endpoints HTTP',
          verifications_title: 'Verificações',
          verifications: {
            connections: { title: 'Conexões', desc: 'Banco de dados, cache, mensageria' },
            resources: { title: 'Recursos', desc: 'CPU, memória, disco, rede' },
            features: { title: 'Funcionalidades', desc: 'Operações críticas do negócio' }
          },
          infrastructure_title: 'Integração com Infraestrutura',
          orchestration_title: 'Orquestração de Containers',
          load_balancers_title: 'Load Balancers',
          load_balancer_features: {
            routing: { title: 'Roteamento', desc: 'Direciona tráfego para instâncias saudáveis' },
            circuit_breaking: { title: 'Circuit Breaking', desc: 'Isola serviços com falha' },
            auto_scaling: { title: 'Auto Scaling', desc: 'Ajusta capacidade baseado em saúde' }
          },
          best_practices_title: 'Melhores Práticas',
          implementation_title: 'Implementação',
          implementation_practices: {
            lightweight: { title: 'Lightweight', desc: 'Checks devem ser leves e rápidos' },
            isolation: { title: 'Isolamento', desc: 'Separe checks por responsabilidade' },
            cache: { title: 'Cache', desc: 'Evite sobrecarga de checks frequentes' }
          },
          monitoring_title: 'Monitoramento',
          monitoring_practices: {
            logging: { title: 'Logging', desc: 'Registre resultados e tendências' },
            metrics: { title: 'Métricas', desc: 'Colete métricas de saúde' },
            alerts: { title: 'Alertas', desc: 'Configure alertas para falhas' }
          }
        }
      },








      security: {
        title: 'Segurança em Sistemas Distribuídos',
        subtitle: 'Explore os principais conceitos e práticas de segurança em sistemas distribuídos',
        info_banner: 'A segurança é um aspecto crítico em sistemas distribuídos. Entenda os principais desafios e soluções para proteger seus sistemas.',
        topics: {
          authentication: {
            title: 'Autenticação',
            description: 'Aprenda como verificar a identidade dos usuários e sistemas de forma segura e escalável.',
            tag1: 'Identidade',
            tag2: 'Segurança'
          },
          authorization: {
            title: 'Autorização',
            description: 'Descubra como implementar controle de acesso granular e gerenciar permissões.',
            tag1: 'Permissões',
            tag2: 'Controle'
          },
          cryptography: {
            title: 'Criptografia',
            description: 'Entenda como proteger dados em trânsito e em repouso usando criptografia.',
            tag1: 'Proteção',
            tag2: 'Privacidade'
          },
          tokens: {
            title: 'Tokens e JWT',
            description: 'Aprenda sobre gerenciamento de sessões e tokens de acesso em sistemas distribuídos.',
            tag1: 'Sessões',
            tag2: 'Stateless'
          },
          ssl_tls: {
            title: 'SSL/TLS',
            description: 'Explore como estabelecer comunicação segura entre sistemas usando SSL/TLS.',
            tag1: 'HTTPS',
            tag2: 'Certificados'
          },
          attacks: {
            title: 'Ataques Comuns',
            description: 'Conheça os ataques mais comuns e aprenda como proteger seus sistemas.',
            tag1: 'Prevenção',
            tag2: 'Mitigação'
          }
        }
      },

      authentication: {
        title: 'Autenticação em Sistemas Distribuídos',
        subtitle: 'Entenda os conceitos, desafios e soluções para autenticação em sistemas distribuídos modernos',
        info_banner: 'A autenticação é um dos pilares fundamentais da segurança em sistemas distribuídos. Em um ambiente onde múltiplos serviços precisam se comunicar e verificar a identidade dos usuários, implementar uma estratégia robusta de autenticação é crucial.',
        basic_concepts_title: 'Conceitos Básicos',
        basic_concepts_description: 'A autenticação é o processo de verificar se alguém ou algo é quem ou o que diz ser. Em sistemas distribuídos, este processo envolve vários componentes e desafios únicos.',
        identification_title: 'Identificação',
        identification_description: 'O processo de um usuário declarar sua identidade ao sistema, geralmente através de um identificador único como nome de usuário ou email.',
        verification_title: 'Verificação',
        verification_description: 'O processo de validar a identidade declarada, geralmente através de credenciais como senha, token ou certificado digital.',
        authentication_methods_title: 'Métodos de Autenticação',
        password_auth_title: 'Autenticação Baseada em Senha',
        password_auth_description: 'O método mais comum de autenticação, onde o usuário fornece uma combinação de identificador e senha.',
        password_auth_items: [
          'Armazenamento seguro com hashing e salt',
          'Políticas de complexidade de senha',
          'Proteção contra ataques de força bruta',
          'Recuperação e reset de senha'
        ],
        token_auth_title: 'Autenticação Baseada em Token',
        token_auth_description: 'Método stateless que utiliza tokens para manter o estado de autenticação.',
        token_auth_items: [
          'JSON Web Tokens (JWT)',
          'Tokens de acesso e refresh',
          'Gerenciamento de sessão',
          'Revogação de tokens'
        ],
        token_auth_link: 'Saiba mais sobre Tokens e JWT',
        oauth_title: 'OAuth 2.0 e OpenID Connect',
        oauth_description: 'Protocolos padrão para autorização e autenticação em sistemas distribuídos.',
        oauth_items: [
          'Fluxos de autorização',
          'Single Sign-On (SSO)',
          'Delegação de acesso',
          'Identity Providers'
        ],
        mfa_title: 'Multi-Factor Authentication (MFA)',
        mfa_description: 'Adiciona camadas extras de segurança além da senha.',
        mfa_items: [
          'Códigos de verificação por SMS ou email',
          'Aplicativos autenticadores (TOTP)',
          'Chaves de segurança física (FIDO2/WebAuthn)',
          'Biometria'
        ],
        challenges_best_practices_title: 'Desafios e Boas Práticas',
        challenges_title: 'Desafios',
        challenges_items: [
          'Escalabilidade do sistema de autenticação',
          'Gerenciamento de sessões distribuídas',
          'Proteção contra ataques comuns',
          'Latência em verificações distribuídas',
          'Consistência entre múltiplos serviços'
        ],
        best_practices_title: 'Boas Práticas',
        best_practices_items: [
          'Usar HTTPS para todas as comunicações',
          'Implementar rate limiting',
          'Logging e monitoramento de tentativas',
          'Rotação regular de chaves e tokens',
          'Validação e sanitização de inputs'
        ],
        implementation_title: 'Implementação',
        implementation_description: 'A implementação de um sistema de autenticação em um ambiente distribuído requer cuidadoso planejamento e consideração de vários aspectos:',
        architecture_title: 'Arquitetura',
        architecture_items: [
          'Serviço centralizado de autenticação',
          'API Gateway para validação',
          'Cache distribuído',
          'Banco de dados de usuários'
        ],
        security_title: 'Segurança',
        security_items: [
          'Criptografia em trânsito',
          'Proteção contra CSRF',
          'Headers de segurança',
          'Auditoria de acessos'
        ],
        experience_title: 'Experiência',
        experience_items: [
          'UX de autenticação',
          'Feedback de erros',
          'Recuperação de acesso',
          'Perfil e preferências'
        ]
      },

      authorization: {
        title: 'Autorização em Sistemas Distribuídos',
        subtitle: 'Controle de acesso, permissões e políticas de segurança em ambientes distribuídos',
        info_banner: 'A autorização é o processo que determina o que um usuário autenticado pode fazer no sistema. Em sistemas distribuídos, implementar uma estratégia eficaz de autorização é essencial para garantir a segurança e o controle granular de acesso aos recursos.',
        fundamental_concepts_title: 'Conceitos Fundamentais',
        authorization_concept_title: 'Autorização',
        authorization_concept_description: 'Processo de verificar se um usuário tem permissão para acessar um recurso ou realizar uma ação específica no sistema.',
        permissions_concept_title: 'Permissões',
        permissions_concept_description: 'Direitos específicos concedidos a usuários ou grupos para realizar operações em recursos do sistema.',
        policies_concept_title: 'Políticas',
        policies_concept_description: 'Regras e condições que definem como as decisões de autorização são tomadas no sistema.',
        access_control_models_title: 'Modelos de Controle de Acesso',
        rbac_title: 'Role-Based Access Control (RBAC)',
        rbac_description: 'Controle de acesso baseado em papéis, onde as permissões são associadas a funções e os usuários são atribuídos a essas funções.',
        rbac_components_title: 'Componentes do RBAC',
        rbac_components: [
          'Usuários: Entidades que precisam acessar recursos',
          'Papéis: Conjuntos de permissões agrupadas',
          'Permissões: Direitos de acesso a recursos',
          'Sessões: Ativação de papéis para usuários'
        ],
        abac_title: 'Attribute-Based Access Control (ABAC)',
        abac_description: 'Modelo que utiliza atributos de usuários, recursos e ambiente para tomar decisões de autorização dinâmicas.',
        abac_attributes_title: 'Atributos Considerados',
        abac_attributes: [
          'Atributos do usuário (cargo, departamento, nível)',
          'Atributos do recurso (tipo, sensibilidade, proprietário)',
          'Atributos do ambiente (hora, localização, dispositivo)',
          'Atributos da ação (leitura, escrita, exclusão)'
        ],
        pbac_title: 'Policy-Based Access Control (PBAC)',
        pbac_description: 'Controle de acesso baseado em políticas que combinam diferentes aspectos de RBAC e ABAC com regras de negócio complexas.',
        pbac_characteristics_title: 'Características',
        pbac_characteristics: [
          'Políticas centralizadas e reutilizáveis',
          'Regras baseadas em condições',
          'Suporte a hierarquias complexas',
          'Auditoria e compliance'
        ],
        distributed_implementation_title: 'Implementação em Sistemas Distribuídos',
        architecture_title: 'Arquitetura',
        architecture_items: [
          'Serviço centralizado de autorização',
          'Cache distribuído de políticas',
          'Propagação de atualizações',
          'Validação em múltiplas camadas'
        ],
        challenges_title: 'Desafios',
        challenges_items: [
          'Latência nas decisões de autorização',
          'Consistência entre serviços',
          'Escalabilidade do sistema',
          'Manutenção de políticas'
        ],
        best_practices_title: 'Boas Práticas',
        design_title: 'Design',
        design_items: [
          'Princípio do menor privilégio',
          'Separação de responsabilidades',
          'Granularidade adequada',
          'Auditoria completa'
        ],
        implementation_title: 'Implementação',
        implementation_items: [
          'Cache inteligente',
          'Decisões em camadas',
          'Monitoramento contínuo',
          'Atualizações atômicas'
        ],
        tools_technologies_title: 'Ferramentas e Tecnologias',
        frameworks_title: 'Frameworks',
        frameworks_items: [
          'OAuth 2.0 e OpenID Connect',
          'Keycloak',
          'Spring Security',
          'IdentityServer'
        ],
        protocols_title: 'Protocolos',
        protocols_items: [
          'XACML',
          'SAML',
          'UMA 2.0',
          'SCIM'
        ],
        services_title: 'Serviços',
        services_items: [
          'AWS IAM',
          'Azure AD',
          'Google Cloud IAM',
          'Auth0'
        ]
      },

      cryptography: {
        title: 'Criptografia em Sistemas Distribuídos',
        subtitle: 'Proteção de dados, comunicação segura e gerenciamento de chaves em ambientes distribuídos',
        simulator_button: 'Experimente o Simulador de Criptografia',
        info_banner: 'A criptografia é fundamental para garantir a segurança em sistemas distribuídos, protegendo dados em repouso e em trânsito. Compreender seus conceitos e implementações é essencial para construir sistemas seguros e confiáveis.',
        fundamentals_title: 'Fundamentos da Criptografia',
        confidentiality_title: 'Confidencialidade',
        confidentiality_description: 'Garante que apenas as partes autorizadas possam acessar e compreender as informações protegidas.',
        integrity_title: 'Integridade',
        integrity_description: 'Assegura que os dados não foram alterados durante o armazenamento ou transmissão.',
        authenticity_title: 'Autenticidade',
        authenticity_description: 'Confirma a origem dos dados e garante que as partes envolvidas são quem dizem ser.',
        types_title: 'Tipos de Criptografia',
        symmetric_title: 'Criptografia Simétrica',
        symmetric_description: 'Utiliza a mesma chave para criptografar e descriptografar dados. É rápida e eficiente para grandes volumes de dados.',
        symmetric_algorithms_title: 'Algoritmos Comuns',
        symmetric_algorithms: [
          'AES (Advanced Encryption Standard)',
          'ChaCha20',
          '3DES (Triple DES)',
          'Blowfish'
        ],
        asymmetric_title: 'Criptografia Assimétrica',
        asymmetric_description: 'Usa um par de chaves (pública e privada) para operações de criptografia e descriptografia.',
        asymmetric_algorithms_title: 'Algoritmos e Usos',
        asymmetric_algorithms: [
          'RSA: Criptografia e assinatura digital',
          'ECC: Curvas elípticas para dispositivos com recursos limitados',
          'Diffie-Hellman: Troca de chaves',
          'Ed25519: Assinaturas digitais modernas'
        ],
        hash_title: 'Funções Hash Criptográficas',
        hash_description: 'Geram uma impressão digital única dos dados, garantindo integridade e não-repúdio.',
        hash_algorithms_title: 'Algoritmos Populares',
        hash_algorithms: [
          'SHA-256/SHA-3: Padrão atual para hashing seguro',
          'BLAKE2/BLAKE3: Alta performance',
          'Argon2: Específico para senhas',
          'HMAC: Hash com chave para autenticação'
        ],
        key_management_title: 'Gerenciamento de Chaves',
        lifecycle_title: 'Ciclo de Vida',
        lifecycle_items: [
          'Geração de chaves segura',
          'Distribuição e troca',
          'Armazenamento protegido',
          'Rotação e revogação'
        ],
        best_practices_title: 'Boas Práticas',
        best_practices_items: [
          'Hardware Security Modules (HSM)',
          'Key Derivation Functions',
          'Backup e recuperação',
          'Auditoria de uso'
        ],
        security_protocols_title: 'Protocolos de Segurança',
        tls_ssl_title: 'TLS/SSL',
        tls_ssl_description: 'Protocolo padrão para comunicação segura na web e entre serviços.',
        tls_ssl_items: [
          'Handshake e negociação de cifras',
          'Certificados digitais',
          'Perfect Forward Secrecy',
          'HTTPS e HSTS'
        ],
        other_protocols_title: 'Outros Protocolos',
        other_protocols_items: [
          'SSH: Acesso remoto seguro',
          'IPsec: Segurança na camada de rede',
          'WireGuard: VPN moderna',
          'Signal Protocol: Mensagens seguras'
        ],
        secure_implementation_title: 'Implementação Segura',
        implementation_intro: 'Ao implementar criptografia em sistemas distribuídos, considere:',
        dont_title: 'Não Faça',
        dont_items: [
          'Implementar próprios algoritmos',
          'Reutilizar chaves ou IVs',
          'Armazenar chaves no código',
          'Ignorar validações'
        ],
        do_title: 'Faça',
        do_items: [
          'Use bibliotecas comprovadas',
          'Implemente Perfect Forward Secrecy',
          'Valide certificados',
          'Monitore e atualize'
        ],
        consider_title: 'Considere',
        consider_items: [
          'Requisitos de performance',
          'Conformidade legal',
          'Recuperação de desastres',
          'Auditoria e logging'
        ]
      },

      cryptography_simulator: {
        title: 'Simulador de Criptografia',
        subtitle: 'Experimente diferentes tipos de criptografia, hashing e codificação na prática',
        text_input_label: 'Texto para Processar',
        text_input_placeholder: 'Digite o texto aqui...',
        key_label: 'Chave (necessária apenas para AES)',
        key_placeholder: 'Chave secreta...',
        operation_label: 'Operação',
        operations: {
          aes: 'Criptografia AES',
          sha256: 'Hash SHA-256',
          md5: 'Hash MD5 (Não recomendado)',
          base64: 'Codificação Base64'
        },
        process_button: 'Processar',
        clear_button: 'Limpar Resultados',
        results_title: 'Resultados',
        no_results: 'Os resultados aparecerão aqui após o processamento...',
        result_labels: {
          input: 'Entrada:',
          output: 'Saída:',
          details: 'Detalhes:'
        },
        error_messages: {
          encryption_error: 'Erro na criptografia',
          check_key_data: 'Verifique a chave e os dados',
          hash_error: 'Erro no hash',
          check_data: 'Verifique os dados',
          encoding_error: 'Erro na codificação',
          key_required: 'Erro: Chave necessária',
          provide_aes_key: 'Forneça uma chave para criptografia AES'
        },
        algorithm_details: {
          aes: 'AES-256-CBC',
          sha256: 'SHA-256',
          md5: 'MD5 (Não recomendado para uso em produção)',
          base64: 'Base64'
        },
        instructions_title: 'Como Usar',
        instructions: [
          'Digite o texto que deseja processar no campo de entrada',
          'Se escolher criptografia AES, forneça uma chave secreta',
          'Selecione a operação desejada no menu suspenso',
          'Clique em "Processar" para ver o resultado',
          'Os últimos 5 resultados serão mantidos para comparação'
        ],
        important_notes_title: 'Notas Importantes',
        important_notes: [
          'AES é um algoritmo de criptografia simétrica seguro e amplamente utilizado',
          'SHA-256 é recomendado para hashing seguro de dados',
          'MD5 é incluído apenas para fins educacionais - não use em produção',
          'Base64 é uma codificação, não uma forma de criptografia'
        ]
      },

      tokens_and_jwt: {
        title: 'Tokens e JWT em Sistemas Distribuídos',
        subtitle: 'Entenda como funcionam tokens e JSON Web Tokens (JWT) em sistemas distribuídos',
        simulator_button: 'Experimente o Simulador de JWT',
        info_banner: 'Tokens são a base da autenticação moderna em sistemas distribuídos, permitindo comunicação segura e sem estado entre diferentes serviços e aplicações.',
        fundamentals_title: 'Fundamentos de Tokens',
        what_are_tokens_title: 'O que são Tokens?',
        tokens_description: 'Tokens são credenciais digitais que representam autorizações e identidades em sistemas distribuídos. Funcionam como um "passe digital" que permite:',
        token_benefits: [
          'Autenticação sem necessidade de armazenar sessões no servidor',
          'Compartilhamento seguro de informações entre serviços',
          'Validação de identidade sem consultas constantes ao banco de dados',
          'Gerenciamento eficiente de permissões e acessos'
        ],
        jwt_section_title: 'JSON Web Tokens (JWT)',
        jwt_standard_title: 'O Padrão JWT',
        jwt_description: 'JWT é um padrão aberto (RFC 7519) que define um formato compacto e seguro para transmissão de informações entre partes como um objeto JSON. Cada token é:',
        jwt_features: [
          'Assinado digitalmente para garantir autenticidade',
          'Codificado em Base64URL para fácil transmissão',
          'Autocontido, carregando todas as informações necessárias',
          'Verificável independentemente do emissor'
        ],
        jwt_anatomy_title: 'Anatomia de um JWT',
        header_title: 'Header',
        header_description: 'Metadados do token, incluindo tipo e algoritmo de assinatura',
        payload_title: 'Payload',
        payload_description: 'Dados do token (claims) que carregam as informações principais',
        signature_title: 'Signature',
        signature_description: 'Assinatura que garante a integridade e autenticidade do token',
        claims_title: 'Claims: O Coração do JWT',
        claims_description: 'Claims são as declarações que compõem o payload do JWT, carregando informações sobre a entidade (geralmente o usuário) e metadados do token.',
        registered_claims_title: 'Claims Registradas',
        registered_claims_description: 'Claims padronizadas pelo JWT, com propósitos específicos:',
        registered_claims: [
          { code: 'iss', name: 'issuer', description: 'Identifica quem emitiu o token' },
          { code: 'sub', name: 'subject', description: 'Identifica o sujeito do token' },
          { code: 'exp', name: 'expiration', description: 'Timestamp de expiração' },
          { code: 'iat', name: 'issued at', description: 'Timestamp de emissão' }
        ],
        public_claims_title: 'Claims Públicas',
        public_claims_description: 'Claims definidas livremente, mas registradas no IANA JWT Registry para evitar colisões. Úteis para informações padronizadas como:',
        public_claims_items: [
          'Nome e informações do usuário',
          'Papéis e permissões',
          'Informações organizacionais'
        ],
        private_claims_title: 'Claims Privadas',
        private_claims_description: 'Claims personalizadas para uso específico entre as partes envolvidas. Ideais para:',
        private_claims_items: [
          'Metadados específicos da aplicação',
          'Configurações personalizadas',
          'Informações de controle interno'
        ],
        best_practices_title: 'Melhores Práticas de Implementação',
        payload_optimization_title: 'Otimização de Payload',
        payload_optimization_description: 'Mantenha tokens compactos para melhor performance:',
        payload_optimization_items: [
          'Inclua apenas dados essenciais',
          'Use nomes curtos para as claims',
          'Evite duplicação de informações'
        ],
        transmission_security_title: 'Segurança na Transmissão',
        transmission_security_description: 'Proteja a transmissão dos tokens:',
        transmission_security_items: [
          'Use sempre HTTPS para transmissão',
          'Implemente rate limiting',
          'Monitore tentativas de acesso suspeitas'
        ],
        lifecycle_management_title: 'Gestão de Ciclo de Vida',
        lifecycle_management_description: 'Gerencie adequadamente a vida útil dos tokens:',
        lifecycle_management_items: [
          'Defina tempos de expiração apropriados',
          'Implemente renovação automática',
          'Mantenha uma lista de tokens revogados'
        ],
        data_protection_title: 'Proteção de Dados',
        data_protection_description: 'Proteja informações sensíveis:',
        data_protection_items: [
          'Nunca inclua credenciais no payload',
          'Evite dados pessoais sensíveis',
          'Use claims privadas para dados internos'
        ],
        auth_flow_title: 'Fluxo de Autenticação com JWT',
        initial_auth_title: 'Autenticação Inicial',
        initial_auth_description: 'O usuário fornece suas credenciais (email/senha) através de um formulário de login seguro. O servidor valida essas credenciais contra o banco de dados.',
        jwt_generation_title: 'Geração do JWT',
        jwt_generation_description: 'Após validação bem-sucedida, o servidor gera um JWT contendo informações relevantes do usuário, como ID, papéis e permissões. O token é assinado com uma chave secreta.',
        secure_storage_title: 'Armazenamento Seguro',
        secure_storage_description: 'O cliente recebe e armazena o token de forma segura, seja em um cookie HTTP-only para aplicações web ou no armazenamento seguro para apps móveis.',
        authenticated_requests_title: 'Requisições Autenticadas',
        authenticated_requests_description: 'Em cada requisição subsequente, o cliente inclui o JWT no header Authorization usando o esquema Bearer: Authorization: Bearer <token>',
        validation_authorization_title: 'Validação e Autorização',
        validation_authorization_description: 'O servidor valida a assinatura do token, verifica a expiração e utiliza as claims para autorizar o acesso aos recursos solicitados.',
        security_considerations_title: 'Considerações de Segurança',
        risks_mitigations_title: 'Riscos e Mitigações',
        xss_attacks_title: 'Ataques XSS',
        xss_attacks_description: 'Proteja-se contra Cross-Site Scripting:',
        xss_protection_items: [
          'Use cookies HTTP-only para tokens',
          'Implemente CSP (Content Security Policy)',
          'Sanitize todas as entradas de usuário'
        ],
        csrf_title: 'CSRF',
        csrf_description: 'Previna Cross-Site Request Forgery:',
        csrf_protection_items: [
          'Use tokens CSRF para operações importantes',
          'Verifique o Origin/Referer header',
          'Implemente SameSite cookies'
        ],
        token_theft_title: 'Roubo de Tokens',
        token_theft_description: 'Minimize o impacto de tokens comprometidos:',
        token_theft_protection_items: [
          'Implemente refresh tokens com rotação',
          'Mantenha expiração curta para access tokens',
          'Monitore padrões suspeitos de uso',
          'Mantenha uma blacklist de tokens revogados'
        ]
      },

      jwt_simulator: {
        title: 'Simulador de JWT',
        subtitle: 'Experimente a geração e validação de tokens JWT na prática',
        token_configuration_title: 'Configuração do Token',
        user_information_title: 'Informações do Usuário',
        name_label: 'Nome',
        email_label: 'Email',
        role_label: 'Papel',
        roles: {
          user: 'Usuário',
          admin: 'Administrador',
          guest: 'Convidado'
        },
        token_settings_title: 'Configurações do Token',
        algorithm_label: 'Algoritmo de Assinatura',
        expiration_label: 'Tempo de Expiração (segundos)',
        custom_claims_title: 'Claims Personalizadas',
        key_placeholder: 'Chave',
        value_placeholder: 'Valor',
        add_claim_button: 'Adicionar Claim',
        generated_token_title: 'Token Gerado',
        verify_token_button: 'Verificar Token',
        no_token_message: 'Configure e gere um token para visualizá-lo aqui',
        decoded_token_title: 'Token Decodificado',
        header_title: 'Header',
        payload_title: 'Payload',
        signature_title: 'Signature',
        verification_result_title: 'Resultado da Verificação',
        verification_messages: {
          no_token: 'Nenhum token para verificar',
          expired: 'Token expirado',
          valid: 'Token válido'
        },
        how_to_use_title: 'Como Usar',
        instructions: [
          'Configure as informações do usuário e as configurações do token no painel esquerdo',
          'Adicione claims personalizadas se desejar (opcional)',
          'Clique em "Gerar Token" para criar um novo JWT',
          'Visualize o token gerado e sua versão decodificada no painel direito',
          'Use o botão "Verificar Token" para simular a validação do token'
        ]
      },

      attack_simulator: {
        back_to_attacks: 'Voltar para Ataques',
        title: 'Simulador de Ataques',
        subtitle: 'Explore de forma interativa como diferentes tipos de ataques funcionam em sistemas distribuídos. Este simulador demonstra visualmente o comportamento e impacto dos ataques DDoS e Man-in-the-Middle.',
        how_to_use_title: 'Como Usar o Simulador',
        how_to_use_steps: [
          'Selecione o tipo de ataque que deseja simular (DDoS ou Man-in-the-Middle)',
          'Ajuste a velocidade da simulação conforme necessário',
          'Clique em "Iniciar Simulação" para começar a visualização',
          'Observe o comportamento dos pacotes e o impacto no servidor'
        ],
        simulator_elements_title: 'Elementos do Simulador',
        simulator_elements: [
          'Clientes legítimos tentando acessar o serviço',
          'Servidor processando as requisições',
          'Atacantes gerando tráfego malicioso',
          'Pacotes legítimos (verde) e maliciosos (vermelho)'
        ],
        ddos_attack_button: 'Ataque DDoS',
        mitm_attack_button: 'Man-in-the-Middle',
        speed_label: 'Velocidade:',
        start_simulation: 'Iniciar Simulação',
        stop_simulation: 'Parar Simulação',
        ddos_simulation_title: 'Simulação de Ataque DDoS',
        ddos_simulation_description: 'Esta simulação mostra como múltiplos atacantes sobrecarregam um servidor com tráfego malicioso, dificultando o acesso de usuários legítimos ao serviço. O servidor fica sobrecarregado ao receber muitas requisições.',
        mitm_simulation_title: 'Simulação de Ataque Man-in-the-Middle',
        mitm_simulation_description: 'Esta simulação demonstra como um atacante pode interceptar a comunicação entre cliente e servidor se posicionando no meio da conexão. O atacante pode ler e modificar os dados transmitidos.',
        legitimate_traffic: 'Tráfego Legítimo',
        malicious_traffic: 'Tráfego Malicioso'
      },

      ssl_tls: {
        title: 'SSL/TLS em Sistemas Distribuídos',
        subtitle: 'Protocolos de segurança para comunicação segura em redes e sistemas distribuídos',
        info_banner: 'SSL/TLS são protocolos fundamentais que garantem a segurança das comunicações na internet, protegendo dados sensíveis e garantindo a autenticidade dos serviços.',
        overview_title: 'Visão Geral',
        what_is_ssl_tls_title: 'O que é SSL/TLS?',
        what_is_ssl_tls_description: 'SSL (Secure Sockets Layer) e seu sucessor TLS (Transport Layer Security) são protocolos criptográficos que fornecem comunicação segura através da internet. Eles operam na camada de transporte, garantindo:',
        ssl_tls_features: [
          'Confidencialidade dos dados',
          'Integridade das mensagens',
          'Autenticação do servidor',
          'Autenticação opcional do cliente'
        ],
        evolution_title: 'Evolução',
        evolution_versions: [
          { version: 'SSL 2.0/3.0', status: 'Obsoleto e inseguro', color: 'red' },
          { version: 'TLS 1.0/1.1', status: 'Descontinuado', color: 'yellow' },
          { version: 'TLS 1.2', status: 'Amplamente suportado', color: 'green' },
          { version: 'TLS 1.3', status: 'Versão mais recente e segura', color: 'blue' }
        ],
        how_it_works_title: 'Como Funciona',
        tls_handshake_title: 'O Handshake TLS',
        handshake_steps: [
          {
            title: 'Client Hello',
            description: 'O cliente inicia a conexão enviando:',
            items: [
              'Versão TLS suportada',
              'Lista de cipher suites',
              'Número aleatório',
              'Extensões suportadas'
            ]
          },
          {
            title: 'Server Hello',
            description: 'O servidor responde com:',
            items: [
              'Certificado digital',
              'Cipher suite escolhida',
              'Número aleatório do servidor',
              'Extensões negociadas'
            ]
          },
          {
            title: 'Key Exchange',
            description: 'Troca de chaves e estabelecimento de segredos:',
            items: [
              'Cliente verifica o certificado',
              'Geração do pre-master secret',
              'Derivação das chaves de sessão'
            ]
          },
          {
            title: 'Finished',
            description: 'Finalização do handshake:',
            items: [
              'Verificação de integridade',
              'Confirmação dos parâmetros',
              'Início da comunicação segura'
            ]
          }
        ],
        digital_certificates_title: 'Certificados Digitais',
        certificate_structure_title: 'Estrutura',
        certificate_structure_items: [
          'Informações do titular',
          'Chave pública',
          'Período de validade',
          'Emissor (CA)',
          'Assinatura digital da CA',
          'Número de série'
        ],
        certificate_types_title: 'Tipos',
        certificate_types: [
          { name: 'DV (Domain Validation)', description: 'Validação básica do domínio' },
          { name: 'OV (Organization Validation)', description: 'Validação da organização' },
          { name: 'EV (Extended Validation)', description: 'Validação extendida e rigorosa' }
        ],
        cipher_suites_title: 'Cipher Suites',
        cipher_suites_description: 'Cipher suites são conjuntos de algoritmos que definem como a comunicação será protegida. Uma cipher suite típica inclui:',
        cipher_components: [
          {
            title: 'Key Exchange',
            algorithms: ['ECDHE', 'DHE', 'RSA']
          },
          {
            title: 'Authentication',
            algorithms: ['RSA', 'ECDSA', 'PSK']
          },
          {
            title: 'Encryption',
            algorithms: ['AES-GCM', 'ChaCha20', 'AES-CBC']
          },
          {
            title: 'MAC',
            algorithms: ['AEAD', 'SHA-384', 'POLY1305']
          }
        ],
        best_practices_title: 'Melhores Práticas',
        configuration_title: 'Configuração',
        configuration_items: [
          'Use apenas TLS 1.2 e 1.3',
          'Desative cipher suites inseguras',
          'Configure HSTS',
          'Implemente OCSP Stapling'
        ],
        certificates_title: 'Certificados',
        certificates_items: [
          'Mantenha certificados atualizados',
          'Use chaves fortes (RSA 2048+ ou ECC)',
          'Implemente renovação automática',
          'Proteja chaves privadas'
        ],
        monitoring_title: 'Monitoramento',
        monitoring_items: [
          'Monitore expiração de certificados',
          'Verifique vulnerabilidades conhecidas',
          'Realize testes de segurança regulares',
          'Mantenha logs de acesso'
        ],
        security_considerations_title: 'Considerações de Segurança',
        common_threats_title: 'Ameaças Comuns',
        common_threats_items: [
          'MITM (Man-in-the-Middle)',
          'Downgrade Attacks',
          'Protocol Vulnerabilities',
          'Certificate Spoofing'
        ],
        mitigations_title: 'Mitigações',
        mitigations_items: [
          'Certificate Pinning',
          'Perfect Forward Secrecy',
          'Strong Cipher Preferences',
          'Regular Security Updates'
        ]
      },

      common_attacks: {
        title: 'Ataques em Sistemas Distribuídos',
        subtitle: 'Compreenda os principais tipos de ataques, seus impactos e estratégias de mitigação',
        warning_banner: 'Ataques a sistemas distribuídos podem causar sérios danos à infraestrutura, comprometer dados sensíveis e resultar em perdas financeiras significativas. É crucial entender e implementar medidas de proteção adequadas.',
        simulator_title: 'Simulador Interativo de Ataques',
        simulator_description: 'Experimente nossa ferramenta interativa que demonstra visualmente como funcionam os ataques DDoS e Man-in-the-Middle. Visualize o impacto dos ataques em tempo real e entenda melhor as estratégias de proteção.',
        simulator_button: 'Acessar Simulador',
        categories_title: 'Categorias de Ataques',
        network_attacks_title: 'Ataques de Rede',
        network_attacks: [
          'DDoS (Distributed Denial of Service)',
          'Man-in-the-Middle (MITM)',
          'DNS Spoofing',
          'ARP Poisoning',
          'TCP/IP Hijacking'
        ],
        application_attacks_title: 'Ataques de Aplicação',
        application_attacks: [
          'SQL Injection',
          'Cross-Site Scripting (XSS)',
          'CSRF (Cross-Site Request Forgery)',
          'Command Injection',
          'File Inclusion'
        ],
        authentication_attacks_title: 'Ataques de Autenticação',
        authentication_attacks: [
          'Brute Force',
          'Dictionary Attacks',
          'Session Hijacking',
          'Credential Stuffing',
          'Password Spraying'
        ],
        ddos_title: 'Ataques DDoS',
        ddos_description: 'Ataques de Negação de Serviço Distribuído (DDoS) visam tornar recursos ou serviços indisponíveis para usuários legítimos sobrecarregando os sistemas com tráfego malicioso.',
        ddos_types_title: 'Tipos Comuns',
        ddos_types: [
          { name: 'Volumétrico', description: 'Inunda a rede com grande volume de tráfego' },
          { name: 'Protocolo', description: 'Explora vulnerabilidades em protocolos de rede' },
          { name: 'Aplicação', description: 'Ataca camada de aplicação com requisições maliciosas' }
        ],
        ddos_mitigation_title: 'Mitigação',
        ddos_mitigation: [
          'Firewalls e WAFs',
          'Rate Limiting',
          'Load Balancing',
          'Traffic Analysis',
          'CDN Protection',
          'Blackholing'
        ],
        mitm_title: 'Ataques Man-in-the-Middle',
        mitm_how_works_title: 'Como Funciona',
        mitm_description: 'O atacante se posiciona entre duas partes que se comunicam, interceptando e potencialmente modificando a comunicação sem que as partes percebam.',
        mitm_techniques: [
          'Interceptação de tráfego',
          'Modificação de dados',
          'Roubo de informações',
          'Falsificação de identidade'
        ],
        mitm_prevention_title: 'Prevenção',
        mitm_prevention: [
          'Uso de TLS/SSL',
          'Certificate Pinning',
          'VPNs',
          'Mutual Authentication',
          'HSTS'
        ],
        injection_title: 'Ataques de Injeção',
        sql_injection_title: 'SQL Injection',
        sql_vulnerability_title: 'Vulnerabilidade',
        sql_vulnerability_description: 'Inserção de código SQL malicioso em entradas de dados para manipular ou extrair informações do banco de dados.',
        sql_prevention_title: 'Prevenção',
        sql_prevention: [
          'Prepared Statements',
          'Input Validation',
          'Escaping',
          'Least Privilege'
        ],
        xss_title: 'Cross-Site Scripting (XSS)',
        xss_vulnerability_title: 'Vulnerabilidade',
        xss_vulnerability_description: 'Injeção de scripts maliciosos em páginas web visualizadas por outros usuários, permitindo roubo de sessões e manipulação do conteúdo.',
        xss_prevention_title: 'Prevenção',
        xss_prevention: [
          'Input Sanitization',
          'Content Security Policy',
          'HttpOnly Cookies',
          'Output Encoding'
        ],
        auth_attacks_title: 'Ataques de Autenticação',
        brute_force_title: 'Brute Force',
        brute_force_description: 'Tentativas sistemáticas de adivinhar credenciais testando todas as combinações possíveis.',
        brute_force_mitigation_title: 'Mitigação',
        brute_force_mitigation: [
          'Rate Limiting',
          'CAPTCHA',
          'Account Lockout',
          'Strong Passwords'
        ],
        session_hijacking_title: 'Session Hijacking',
        session_hijacking_description: 'Roubo ou falsificação de tokens de sessão para acessar contas de usuários autenticados.',
        session_hijacking_mitigation_title: 'Mitigação',
        session_hijacking_mitigation: [
          'Secure Session Management',
          'SSL/TLS',
          'Session Timeout',
          'Regenerate IDs'
        ],
        credential_stuffing_title: 'Credential Stuffing',
        credential_stuffing_description: 'Uso automatizado de pares de usuário/senha vazados para tentar acesso em múltiplos serviços.',
        credential_stuffing_mitigation_title: 'Mitigação',
        credential_stuffing_mitigation: [
          'Multi-factor Authentication',
          'Password Policies',
          'Breach Detection',
          'IP-based Rate Limiting'
        ],
        best_practices_title: 'Melhores Práticas de Segurança',
        prevention_title: 'Prevenção',
        prevention_practices: [
          'Mantenha todos os sistemas e dependências atualizados',
          'Implemente autenticação forte e multi-fator',
          'Use HTTPS em todas as comunicações',
          'Valide e sanitize todas as entradas de usuário',
          'Implemente logging e monitoramento adequados'
        ],
        monitoring_title: 'Monitoramento',
        monitoring_practices: [
          'Configure alertas para comportamentos suspeitos',
          'Realize auditorias de segurança regulares',
          'Mantenha logs de acesso e atividades',
          'Implemente detecção de intrusão',
          'Monitore métricas de performance e disponibilidade'
        ]
      },

      simulators_extra: {
        replication: {
          title: 'Simulador de Replicação',
          intro: 'Explore como diferentes estratégias de replicação afetam a consistência e disponibilidade dos dados.',
          how_title: 'Como usar o simulador:',
          steps: [
            'Escolha o tipo de replicação: Síncrona, Semi-síncrona, ou Assíncrona',
            'Ajuste os parâmetros: latência de rede, taxa de falha, número de réplicas',
            'Observe os resultados: tempo de propagação, status por região, impacto de falhas'
          ],
          config_title: 'Configurações',
          replication_type: 'Tipo de Replicação',
          sync: 'Síncrona', semi_sync: 'Semi-síncrona', async: 'Assíncrona',
          network_latency_ms: 'Latência de Rede (ms)',
          failure_rate: 'Taxa de Falha',
          replica_count: 'Número de Réplicas',
          manual_title: 'Operação Manual',
          key_placeholder: 'Chave', value_placeholder: 'Valor', write: 'Escrever',
          start: 'Iniciar Simulação', stop: 'Parar Simulação',
          statuses: { healthy: 'saudável', failed: 'falho', role: 'Papel', latency: 'Latência', data: 'Dados', keys_label: '{{count}} chaves', replicated_after: 'Replicado após {{seconds}}s' },
          simulate_failure: 'Simular Falha', recover: 'Recuperar',
          recent_ops: 'Requisições Recentes', read_label: 'Leitura', write_label: 'Escrita'
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    load: 'languageOnly',
    supportedLngs: ['en', 'pt'],
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false
    },
    detection: {
      // Only use localStorage if language was explicitly chosen by user
      order: ['localStorage'],
      caches: [] // Don't auto-cache, let LanguageDetectionDialog handle this
    }
  });

export default i18n; 