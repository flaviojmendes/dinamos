import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      admin: {
        control_center: 'Control Center',
        access_denied: 'Access Denied',
        hub: {
          title: 'Admin Control Center',
          subtitle: 'Everything you can manage, in one place.'
        },
        sections: {
          content: 'Content & Learning',
          community: 'Community',
          system: 'People & System'
        },
        cards: {
          organize: {
            title: 'Organize Content',
            description: 'Drag & drop modules and lessons to nest, reorder, and reassign.'
          },
          content: {
            title: 'Content Pages',
            description: 'Create and edit MDX lessons, titles, and simulators per language.'
          },
          modules: {
            title: 'Modules',
            description: 'Define learning modules, tiers, and base paths.'
          },
          challenges: {
            title: 'Challenges',
            description: 'Manage system-design challenges and their solutions.'
          },
          quizzes: {
            title: 'Quizzes',
            description: 'Author quizzes, questions, and themes.'
          },
          game: {
            title: 'Game Mode',
            description: 'Configure gamified learning experiences.'
          },
          forum_categories: {
            title: 'Forum Categories',
            description: 'Organize discussion categories for the community forum.'
          },
          notifications: {
            title: 'Notifications',
            description: 'Broadcast announcements and manage notifications.'
          },
          users: {
            title: 'Users',
            description: 'View users and account details.'
          },
          roles: {
            title: 'Roles',
            description: 'Manage roles and permission assignments.'
          },
          analytics: {
            title: 'Analytics',
            description: 'Platform metrics, growth, and engagement charts.'
          },
          settings: {
            title: 'Settings',
            description: 'Global platform configuration.'
          }
        }
      },
      command_center: {
        title: 'Dashboard',
        session_active: 'Active',
        operator: 'Welcome back,',
        readiness_suffix: '— {{pct}}% complete',
        quick_jump: 'Quick jump',
        modules_cleared: 'Modules done',
        readiness: 'Progress',
        progress_overview: 'Progress overview',
        ring_complete: 'complete',
        stat_lessons: 'Lessons',
        stat_in_progress: 'In progress',
        coins_label: 'DinaCoins',
        greeting_subtitle: 'Pick up where you left off.',
        operation_activity: 'Up next',
        recommended_next: 'Recommended next',
        deploy: 'Start',
        all_cleared: 'All lessons complete',
        all_cleared_sub: 'Every module is done. Revisit a topic or jump into the Practice Arena.',
        modules_empty: 'No modules yet — content is loading or none are available.',
        activity_empty_sub: 'Be the first to start a discussion in the forum.',
        mission_table: 'Modules',
        col_operation: 'Module',
        col_priority: 'Level',
        col_progress: 'Progress',
        col_status: 'Status',
        activity_feed: 'Recent activity',
        view_all: 'View all',
        no_transmissions: 'No recent activity',
        replies: '{{count}} replies',
        search_placeholder: 'Search lessons...',
        search_aria: 'Search lessons',
        no_matches: 'No matches',
        time_now: 'now',
        action_review: 'Review',
        action_resume: 'Resume',
        action_start: 'Start',
        tier: {
          foundational: 'Foundational',
          core: 'Core',
          advanced: 'Advanced',
          applied: 'Applied'
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
          tools: 'Tools & Community',
          practice: 'Practice Arena'
        }
      },
      quick_access: {
        title: 'QUICK ACCESS',
        command_center: 'Command Center',
        roadmap: 'Roadmap',
        editor: 'System Editor',
        forum: 'Forum',
        preferences: 'Preferences'
      },
      common: {
        start_now: 'Start Now',
        view_content: 'View Content',
        free_editor: 'Free Editor!',
        access_free_editor: 'Access the Distributed Systems Editor for free, no signup required!',
        loading: 'Loading roadmap...'
      },
      footer: {
        all_rights_reserved: 'All rights reserved.',
        privacy_policy: 'Privacy Policy',
        terms: 'Terms of Service',
        open_source: 'Open source'
      },
      protected_route: {
        loading: 'Loading...'
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
        coming_soon: 'Coming soon'
      },
      content: {
        mark_complete: 'Mark as completed',
        completed_label: 'Completed',
        reading_time: '{{minutes}} min read'
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
      preferences: {
        title: 'Preferences',
        account_info: 'Account Information',
        email: 'Email',
        creation_date: 'Sign-up Date',
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
              'Community features and progress tracking'
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
          ip_rights: {
            title: '4. Intellectual Property & Attribution',
            intro: 'All educational content on the Service is free to access, study, and share. We ask only one thing in return: always credit the platform. Whenever you use, reference, or reproduce our content — including in videos, courses, classes, presentations, articles, social media, or any other medium — you must:',
            items: [
              'Give clear and visible credit to Dinamos (trilhainfo) as the source of the content',
              'Include a link back to the platform (https://instagram.com/trilhainfo) whenever the medium allows it',
              'Keep any copyright, trademark, or authorship notices intact',
              'Not present our content as your own or imply official endorsement, partnership, or affiliation without permission'
            ]
          },
          conduct: {
            title: '5. User Conduct',
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
            title: '6. Service Availability',
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
            title: '7. Privacy and Data Protection',
            paragraphs: [
              'Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated by reference.',
              'By using the Service, you consent to our data practices as described in the Privacy Policy.'
            ]
          },
          disclaimer: {
            title: '8. Disclaimer of Warranties',
            intro: 'The Service is provided "as is" and "as available" without warranties of any kind, including:',
            items: [
              'Merchantability or fitness for a particular purpose',
              'Non-infringement of third-party rights',
              'Accuracy, completeness, or reliability of content',
              'Uninterrupted or error-free operation'
            ]
          },
          liability: {
            title: '9. Limitation of Liability',
            intro: 'To the maximum extent permitted by law, Dinamos is not liable for indirect, incidental, special, consequential, or punitive damages, including:',
            items: [
              'Loss of profits, data, or other intangible losses',
              'Damages from use or inability to use the Service',
              'Damages from unauthorized access to your data'
            ],
            note: 'Total liability is limited to the amount you paid for the Service in the 12 months preceding the claim.'
          },
          indemnification: {
            title: '10. Indemnification',
            intro: 'You agree to indemnify and hold harmless Dinamos from claims, damages, losses, or expenses arising from:',
            items: [
              'Your use of the Service',
              'Your violation of these Terms',
              'Your violation of third-party rights',
              'Content you submit or share through the Service'
            ]
          },
          termination: {
            title: '11. Termination',
            intro: 'We may terminate or suspend your account and access immediately without notice for reasons including:',
            items: [
              'Breach of these Terms',
              'Fraudulent or illegal activity',
              'Extended inactivity'
            ],
            note: 'Upon termination, your right to use the Service ceases immediately; provisions on IP, disclaimers, and limitations survive.'
          },
          governing_law: {
            title: '12. Governing Law',
            paragraphs: [
              'These Terms are governed by the laws of Brazil, without regard to conflict of law provisions.',
              'Disputes are subject to the exclusive jurisdiction of the courts of Brazil.'
            ]
          },
          changes: {
            title: '13. Changes to Terms',
            intro: 'We may modify these Terms at any time. If we make material changes, we will notify you by:',
            items: [
              'Posting the updated Terms on this page',
              'Updating the "Last updated" date',
              'Sending notice via email or through the Service'
            ],
            note: 'Continued use after changes constitutes acceptance of the new Terms.'
          },
          contact: {
            title: '14. Contact Information',
            intro: 'If you have questions about these Terms, contact us:',
            items: [
              'Email: flavio@trilha.info',
              'Through our website contact form'
            ]
          },
          severability: {
            title: '15. Severability',
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
      landing: {
        hero_title: 'Master Distributed Systems in Practice',
        hero_subtitle: 'The most complete platform to learn system architecture with interactive simulators and real cases',
        hero_eyebrow: 'Distributed systems learning platform',
        header_signin: 'Sign in',
        hero_explore: 'Explore the content',
        hero_trust: 'Free forever · No credit card · 1-click sign in',
        signin_title: 'Sign in to start learning',
        signin_subtitle: 'Track your progress, run every simulator and join the community — in one click.',
        stat_simulators_value: '15+',
        stat_simulators_label: 'Interactive simulators',
        stat_cases_value: '6',
        stat_cases_label: 'Real-world case studies',
        stat_scale_value: '1.5B+',
        stat_scale_label: 'Requests / year analyzed',
        stat_price_value: '$0',
        stat_price_label: 'Cost, forever',
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
        journey_advanced_topics_item2: 'Lamport\'s Logical Clocks',
        journey_advanced_topics_item3: 'Event-Driven Architecture',
        journey_advanced_topics_description: 'Explore advanced concepts and deepen your knowledge',
        journey_real_cases_title: 'Real Cases',
        journey_real_cases_item1: 'YouTube and Netflix',
        journey_real_cases_item2: 'Spotify and WhatsApp',
        journey_real_cases_item3: 'Uber and Bit.ly',
        journey_real_cases_description: 'Apply your knowledge by analyzing real success cases',
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
        free_badge: 'FREE',
        free_title: 'Completely Free Access',
        free_subtitle: 'All content available at no cost. Learn distributed systems without any barriers.',
        free_price: 'FREE',
        free_description: 'Full access to all content, simulators, and real cases. No credit card required.',
        cta_free_title: 'Start Learning Today!',
        cta_free_subtitle: 'Full access to all content, 100% free.',
        open_source_label: 'Open source',
        open_source_title: 'Built in the open',
        open_source_subtitle: 'Dinamos is free and fully open source. Read the code, open an issue, or send a pull request. The whole platform lives on GitHub.',
        open_source_cta: 'View on GitHub',
        open_source_contribute: 'Contributions welcome',
        scroll_hint: 'Scroll to explore',
        hero_uptime: '99.99% uptime',
        stats_label: 'By the numbers',
        topology_label: 'Live system',
        topology_title: 'Follow a request through the stack',
        topology_subtitle: 'Client to load balancer to nodes to cache and database — every hop here is something you can open, run, and break inside a simulator.',
        topology_node_client: 'client',
        topology_node_lb: 'load balancer',
        topology_node_cache: 'cache',
        topology_node_db: 'database',
        topology_card1_title: 'Load balancing',
        topology_card1_text: 'Spread traffic across healthy nodes and watch routing adapt as instances come and go.',
        topology_card2_title: 'Caching',
        topology_card2_text: 'Cut latency and shield your database by serving hot reads straight from memory.',
        topology_card3_title: 'Resilience',
        topology_card3_text: 'Circuit breakers, timeouts and retries stop a single failure from cascading.',
        topology_card4_title: 'Replication',
        topology_card4_text: 'Replicate state across regions and reason about real consistency trade-offs.',
        features_label: 'What you learn',
        showcase_label: 'Inside the lab',
        journey_label: 'Roadmap',
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
            consistency: {
              description: 'All nodes see the same data at the same time. Every read receives the most recent write or an error.'
            },
            availability: {
              description: 'The system remains operational 100% of the time. Every request receives a response.'
            },
            partition_tolerance: {
              description: 'The system continues to operate despite network failures between nodes.'
            },
            cp_systems: {
              description: 'Prioritize data consistency over availability during network partitions'
            },
            ap_systems: {
              description: 'Prioritize system availability over immediate consistency during partitions'
            },
            ca_systems: {
              description: 'Traditional systems that sacrifice partition tolerance'
            }
          },
          consistency_models: {
            name: 'Consistency Models',
            description: 'Strong, eventual, and weak consistency patterns',
            strong_consistency: {
              description: 'All nodes see the same data at the same time. After a write operation, all subsequent reads will return the updated value.'
            },
            eventual_consistency: {
              description: 'The system will become consistent over time, given that the system doesn\'t receive new updates. Reads may return stale data temporarily.'
            },
            weak_consistency: {
              description: 'After a write, reads may or may not see the updated value. The system makes no guarantees about when data will be consistent.'
            }
          },
          distributed_challenges: {
            name: 'Distributed Challenges',
            description: 'Common problems in distributed systems',
            network_partitions: {
              description: 'Network failures that split the system into isolated groups, forcing trade-offs between consistency and availability.'
            },
            clock_sync: {
              description: 'Different nodes have different clocks, making it difficult to order events and maintain consistency.'
            },
            partial_failures: {
              description: 'Some parts of the system fail while others continue working, creating inconsistent states.'
            },
            consensus: {
              description: 'Getting distributed nodes to agree on a single value or decision in the presence of failures.'
            },
            state_management: {
              description: 'Keeping track of system state across multiple nodes while handling concurrent updates.'
            },
            race_conditions: {
              description: 'Multiple processes accessing shared resources simultaneously, leading to unpredictable results.'
            }
          },
          network_partitions: {
            name: 'Network Partitions & Failures',
            description: 'Handling network splits and node failures',
            what_is: {
              description: 'A network partition occurs when the network between nodes fails, splitting the system into isolated groups that cannot communicate with each other.'
            },
            causes: {
              description: 'Network partitions can arise from various infrastructure and configuration issues that affect connectivity between distributed nodes.'
            },
            failure_types: {
              description: 'Different failure modes require different detection and handling strategies in distributed systems.',
              fail_stop: {
                description: 'Node stops completely and other nodes can detect the failure'
              },
              fail_slow: {
                description: 'Node becomes very slow but doesn\'t crash completely'
              },
              byzantine: {
                description: 'Node behaves arbitrarily or maliciously'
              }
            },
            partition_scenarios: {
              datacenter_split: {
                description: 'When datacenters lose connectivity, each must decide how to handle ongoing operations'
              },
              service_mesh_partition: {
                description: 'When services in a mesh lose connectivity to subsets of other services'
              },
              database_partition: {
                description: 'When database nodes become isolated from each other'
              }
            },
            detection: {
              description: 'Early and accurate detection of network partitions is crucial for implementing appropriate response strategies.'
            },
            prevention: {
              description: 'While partitions cannot be completely prevented, their likelihood and impact can be significantly reduced through proper infrastructure design.'
            },
            recovery: {
              description: 'When partitions heal, systems must carefully reconcile state and resolve any conflicts that occurred during the partition.'
            }
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
          canary_deployment: {
            name: 'Canary Deployment',
            description: 'Gradual rollout with traffic shifting and instant rollback',
            simulator: {
              name: 'Canary Deployment Simulator',
              description: 'Deploy a canary, shift traffic, and watch the metrics'
            }
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
        },
        home: {
          name: 'Design Lab',
          description: 'Solve architecture challenges with AI feedback'
        },
        quizzes: {
          name: 'Quizzes',
          description: 'Test your knowledge and earn DinaCoins'
        },
        ranking: {
          name: 'Ranking',
          description: 'Global community leaderboard'
        },
        profile: {
          name: 'Profile',
          description: 'Your progress, solutions and DinaCoins'
        },
        notifications: {
          name: 'Notifications',
          description: 'Replies, mentions and announcements'
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
        atomic_consensus: 'Atomic Consensus'
      },
      prerequisites: {
        design_principles: 'Design Principles'
      },
      categories: {
        advanced: 'Advanced'
      },
      roadmap: {
        title: 'Learning Roadmap',
        description_1: 'Follow this structured guide to master distributed systems concepts.',
        description_2: 'The roadmap is organized into a logical learning sequence, with clear prerequisites and skills to be developed in each step.',
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
          arrange_vertical: 'Arrange vertically',
          arrange_horizontal: 'Arrange horizontally',
          undo: 'Undo (Ctrl/Cmd+Z)',
          redo: 'Redo (Ctrl/Cmd+Shift+Z)'
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
          delete_edge: 'Delete connection',
          arrange_vertical: 'Arrange vertically',
          arrange_horizontal: 'Arrange horizontally'
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
          match_fixed: 'fixed by match',
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
          dist: {
            lognormal: 'Lognormal',
            exponential: 'Exponential',
            deterministic: 'Deterministic'
          },
          strat: {
            roundRobin: 'Round Robin',
            leastConnections: 'Least Connections',
            weighted: 'Weighted',
            hashing: 'Consistent Hashing'
          },
          cons: {
            strong: 'Strong',
            quorum: 'Quorum',
            eventual: 'Eventual'
          },
          shard_strat: {
            hash: 'Hash',
            range: 'Range'
          }
        },
        bill: {
          title: '{{provider}} bill',
          open_hint: 'Click to see the cost breakdown by product',
          close: 'Close',
          empty: 'No billable resources yet. Run the simulation.',
          units: '{{count}} resource',
          total: 'Total',
          accumulated: 'Accumulated this run'
        },
        dashboard: {
          offered: 'Offered',
          throughput: 'Throughput',
          success: 'Success',
          p95: 'p95',
          success_total: 'Successful reqs',
          success_total_hint: 'Total requests served OK this run',
          failed_total: 'Failed reqs',
          failed_total_hint: 'Total requests failed/dropped this run',
          in_flight: 'In-flight',
          cost: '{{provider}} cost',
          error_budget: 'Error budget used (SLO {{slo}}%)',
          chart_throughput: 'Throughput vs Offered (req/s)',
          chart_latency: 'Latency percentiles (ms)',
          chart_success: 'Success rate (%) & in-flight',
          accumulated_cost: 'Accumulated cost this run:',
          golden_title: 'Four Golden Signals',
          golden: {
            latency: 'Latency',
            latency_hint: 'How long requests take',
            traffic: 'Traffic',
            traffic_hint: 'Demand on the system',
            errors: 'Errors',
            errors_hint: 'Failed requests',
            saturation: 'Saturation',
            saturation_hint: 'Busiest resource load'
          }
        },
        scenario: {
          preset: 'Preset',
          load_profile: 'Load profile',
          cloud: 'Cloud',
          chaos: 'Chaos',
          load: 'Load',
          inject: 'Inject',
          profiles: {
            constant: 'Constant',
            ramp: 'Ramp',
            spike: 'Spike',
            diurnal: 'Diurnal',
            step: 'Step'
          },
          chaos_types: {
            killNode: 'Kill node',
            latencyInjection: 'Inject latency',
            partition: 'Partition'
          },
          presets: {
            'three-tier': 'Three-Tier Web App',
            'read-heavy-cache': 'Read-Heavy + Cache',
            'event-driven': 'Event-Driven + Queue',
            'sharded-store': 'Sharded Datastore',
            'microservice-mesh': 'Microservice Mesh',
            'url-shortener': 'URL Shortener',
            'ticket-booking': 'Ticket Booking Site',
            'chat-messaging': 'Chat / Messaging (WhatsApp)',
            'social-feed': 'Social News Feed',
            'video-streaming': 'Video Streaming'
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
          components: 'Components',
          speed: 'Speed',
          seed: 'Seed'
        },
        errors: {
          import_error: 'Error importing file. Invalid or corrupted format.',
          read_error: 'Error reading file. Please try again.'
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
      components: {
        common: {
          simulator_title: 'Interactive Simulator'
        }
      },
      simulators: {
        consistent_hashing: {
          title: 'Consistent Hashing Simulator',
          subtitle: 'Keys on a ring — add/remove nodes and watch them remap',
          controls: {
            vnodes: 'Virtual nodes per node',
            keys: 'Number of keys'
          },
          buttons: {
            add_node: 'Add node',
            remove_node: 'Remove node',
            shuffle: 'Shuffle keys',
            reset: 'Reset'
          },
          metrics: {
            title: 'Live Metrics',
            nodes: 'Nodes',
            vnodes: 'Virtual nodes',
            keys: 'Keys',
            moved: 'Keys moved',
            imbalance: 'Load imbalance'
          },
          labels: {
            node: 'Node',
            hint: 'Add or remove a node — only the highlighted keys move. More virtual nodes means smoother distribution.'
          }
        },
        sharding: {
          title: 'Sharding Simulator',
          subtitle: 'Route keys to shards by range or hash — and watch skew',
          controls: {
            shards: 'Number of shards',
            strategy: 'Strategy',
            skew: 'Key skew'
          },
          strategies: {
            hash: 'Hash',
            range: 'Range'
          },
          buttons: {
            start: 'Start',
            stop: 'Stop',
            reset: 'Reset'
          },
          metrics: {
            title: 'Live Metrics',
            keys: 'Keys routed',
            shards: 'Shards',
            imbalance: 'Load imbalance',
            hot_load: 'Hottest shard'
          },
          labels: {
            shard: 'Shard',
            hint: 'Crank up skew with range partitioning to create a hot shard — then switch to hash to even it out.'
          }
        },
        inverted_index: {
          title: 'Inverted Index Simulator',
          subtitle: 'Pick query terms and watch documents rank by score',
          modes: {
            or: 'OR (any term)',
            and: 'AND (all terms)'
          },
          buttons: {
            clear: 'Clear'
          },
          metrics: {
            title: 'Live Metrics',
            terms: 'Query terms',
            matched: 'Matched docs',
            postings: 'Postings scanned',
            corpus: 'Corpus size'
          },
          labels: {
            query: 'Query terms',
            documents: 'Documents',
            index: 'Inverted index',
            results: 'Ranked results',
            doc: 'Doc',
            score: 'score',
            no_matches: 'No matching documents',
            hint: 'AND intersects postings lists; OR unions them. Score counts how many query terms each document contains.'
          }
        },
        kafka: {
          title: 'Kafka Simulator',
          subtitle: 'Producers, partitions, and a consumer group — watch the lag',
          controls: {
            partitions: 'Partitions',
            consumers: 'Consumers',
            produce_rate: 'Produce rate',
            consume_rate: 'Consume / consumer'
          },
          buttons: {
            start: 'Start',
            stop: 'Stop',
            reset: 'Reset'
          },
          metrics: {
            title: 'Live Metrics',
            produced: 'Produced',
            consumed: 'Consumed',
            lag: 'Consumer lag',
            throughput: 'Consume capacity'
          },
          labels: {
            partition: 'P',
            producer: 'Producer',
            consumers: 'Consumer group',
            consumer: 'C',
            idle: 'idle',
            hint: 'Each partition is read by exactly one consumer. Add consumers beyond the partition count and they sit idle — partitions cap parallelism.'
          }
        },
        saga: {
          title: 'Saga Simulator',
          subtitle: 'A distributed transaction as a sequence of compensable steps',
          controls: {
            mode: 'Coordination',
            fail_at: 'Inject failure at step'
          },
          modes: {
            orchestrated: 'Orchestrated',
            choreographed: 'Choreographed'
          },
          fail_none: 'None',
          buttons: {
            run: 'Run saga',
            reset: 'Reset'
          },
          roles: {
            coordinator: 'Saga Coordinator'
          },
          steps: {
            reserve: 'Reserve inventory',
            payment: 'Charge payment',
            shipping: 'Book shipping',
            confirm: 'Send confirmation'
          },
          status: {
            pending: 'Pending',
            running: 'Running',
            done: 'Committed',
            failed: 'Failed',
            compensated: 'Compensated'
          },
          metrics: {
            title: 'Result',
            committed: 'Steps committed',
            compensated: 'Steps compensated',
            outcome: 'Outcome'
          },
          outcome: {
            idle: 'Idle',
            committed: 'Committed',
            rolled_back: 'Rolled back'
          },
          labels: {
            hint: 'A saga has no global rollback. When a step fails, each completed step is undone by its own compensating action, in reverse order.'
          }
        },
        delivery_semantics: {
          title: 'Delivery Semantics Simulator',
          subtitle: 'At-most-once vs at-least-once vs exactly-once',
          controls: {
            mode: 'Semantics',
            dedup: 'Deduplication',
            dlq: 'Dead-letter queue'
          },
          modes: {
            at_most_once: 'At-most-once',
            at_least_once: 'At-least-once',
            exactly_once: 'Exactly-once'
          },
          buttons: {
            start: 'Start',
            stop: 'Stop',
            reset: 'Reset',
            on: 'On',
            off: 'Off'
          },
          metrics: {
            title: 'Live Metrics',
            produced: 'Produced',
            delivered: 'Delivered',
            duplicates: 'Duplicates',
            filtered: 'Dedup filtered',
            lost: 'Lost',
            dlq: 'Dead-lettered'
          },
          tags: {
            delivered: 'Delivered',
            duplicate: 'Duplicate',
            lost: 'Lost',
            dlq: 'Dead-letter',
            filtered: 'Filtered'
          },
          labels: {
            recent: 'Recent messages',
            empty: 'No messages yet',
            hint: 'At-most-once can lose messages; at-least-once can duplicate them. "Exactly-once" = at-least-once delivery plus deduplication on the consumer.'
          }
        },
        cqrs: {
          title: 'CQRS Simulator',
          subtitle: 'Commands append events; read models are projections',
          controls: {
            lag: 'Projection lag'
          },
          commands: {
            create: 'Create order',
            add_item: 'Add item',
            ship: 'Ship order',
            cancel: 'Cancel order'
          },
          buttons: {
            reset: 'Reset'
          },
          panels: {
            command: 'Command side (write)',
            log: 'Event log',
            read: 'Read models (query)'
          },
          events: {
            created: 'OrderCreated',
            item_added: 'ItemAdded',
            shipped: 'OrderShipped',
            cancelled: 'OrderCancelled'
          },
          read: {
            status: 'Order status',
            items: 'Item count',
            events_applied: 'Events applied',
            pending: 'Pending'
          },
          status_values: {
            none: '—',
            created: 'Created',
            shipped: 'Shipped',
            cancelled: 'Cancelled'
          },
          labels: {
            log_empty: 'No events yet — issue a command',
            lag_caption: 'Projection caught up: {{pct}}%',
            hint: 'Writes go to the event log instantly; read models update asynchronously. Raise the lag to see eventual consistency — the read side trails the write side.'
          }
        },
        inference_batching: {
          title: 'Inference Batching Simulator',
          subtitle: 'Continuous batching on a single GPU — throughput vs latency',
          controls: {
            arrival_rate: 'Arrival rate (req/s)',
            batch_capacity: 'Batch capacity (KV slots)',
            output_tokens: 'Avg output tokens'
          },
          buttons: {
            start: 'Start',
            stop: 'Stop',
            reset: 'Reset'
          },
          panels: {
            batch: 'Running Batch (GPU)',
            queue: 'Admission Queue',
            metrics: 'Live Metrics'
          },
          metrics: {
            throughput: 'Throughput (tok/s)',
            utilization: 'Batch utilization',
            queue_depth: 'Queue depth',
            avg_latency: 'Avg latency',
            completed: 'Completed',
            dropped: 'Dropped'
          },
          labels: {
            slot_free: 'free slot',
            tokens: 'tok',
            waiting: 'waiting',
            batch_empty: 'GPU idle — no requests in batch',
            queue_empty: 'Queue empty',
            request: 'REQ'
          }
        },
        rag_pipeline: {
          title: 'RAG Pipeline Simulator',
          subtitle: 'Embed → search → rerank → assemble → generate',
          controls: {
            chunk_size: 'Chunk size (tokens)',
            top_k: 'Retrieve top-K',
            rerank: 'Reranking'
          },
          buttons: {
            run: 'Run Query',
            reset: 'Reset',
            on: 'On',
            off: 'Off'
          },
          stages: {
            embed: 'Embed Query',
            search: 'Vector Search',
            rerank: 'Rerank',
            assemble: 'Assemble Context',
            generate: 'Generate'
          },
          metrics: {
            recall: 'Retrieval recall',
            latency: 'Total latency',
            cost: 'Cost / query',
            context: 'Context used',
            quality: 'Answer quality'
          },
          labels: {
            idle: 'Idle — run a query to start',
            chunk: 'chunk',
            score: 'score',
            retrieved: 'Retrieved chunks',
            disabled: 'disabled'
          }
        },
        vector_search: {
          title: 'Vector Search Simulator',
          subtitle: 'Approximate nearest neighbors with HNSW',
          controls: {
            ef_search: 'efSearch (candidate list)',
            m_links: 'M (graph connections)',
            dataset: 'Dataset size'
          },
          buttons: {
            search: 'Run Search',
            reset: 'Reset'
          },
          metrics: {
            recall: 'Recall@10',
            latency: 'Query latency',
            comparisons: 'Distance comps',
            memory: 'Index memory'
          },
          labels: {
            idle: 'Run a search to probe the index',
            exact: 'Exact (brute force)',
            approx: 'HNSW (approximate)',
            found: 'Neighbors found'
          }
        },
        llm_gateway: {
          title: 'LLM Gateway Simulator',
          subtitle: 'Semantic cache, model fallback, rate limiting & cost',
          controls: {
            cache_rate: 'Cache hit rate (%)',
            rate_limit: 'Rate limit (req/s)',
            primary_fail: 'Primary failure (%)'
          },
          buttons: {
            start: 'Start',
            stop: 'Stop',
            reset: 'Reset'
          },
          routes: {
            cache: 'Served from cache',
            primary: 'Primary model',
            fallback: 'Fallback model',
            rejected: 'Rate limited'
          },
          metrics: {
            served: 'Served',
            cache_hits: 'Cache hits',
            fallbacks: 'Fallbacks',
            rejected: 'Rejected',
            cost: 'Total cost'
          },
          labels: {
            recent: 'Recent requests',
            empty: 'No requests yet'
          }
        },
        gpu_autoscaler: {
          title: 'GPU Autoscaler Simulator',
          subtitle: 'Cold starts, queueing & scale-to-zero',
          controls: {
            arrival_rate: 'Arrival rate (req/s)',
            scale_threshold: 'Scale-up queue threshold',
            cold_start: 'Cold start (s)'
          },
          buttons: {
            start: 'Start',
            stop: 'Stop',
            reset: 'Reset'
          },
          panels: {
            replicas: 'GPU Replicas',
            metrics: 'Live Metrics'
          },
          metrics: {
            replicas: 'Active replicas',
            queue: 'Queue depth',
            latency: 'Avg latency',
            cost: 'Cost ($/min)',
            utilization: 'Utilization'
          },
          labels: {
            warming: 'WARMING',
            ready: 'READY',
            idle: 'IDLE',
            scale_to_zero: 'Scaled to zero — no active GPUs'
          }
        },
        agent_orchestration: {
          title: 'Agent Orchestration Simulator',
          subtitle: 'Reason → act → observe loop with tool calls',
          controls: {
            max_steps: 'Max steps',
            tool_latency: 'Tool latency (ms)',
            fail_rate: 'Tool failure (%)'
          },
          buttons: {
            run: 'Run Agent',
            reset: 'Reset'
          },
          steps: {
            think: 'Think',
            act: 'Call Tool',
            observe: 'Observe',
            answer: 'Final Answer',
            retry: 'Retry'
          },
          tools: {
            search: 'web_search',
            calculator: 'calculator',
            database: 'db_query'
          },
          metrics: {
            steps: 'Steps taken',
            tool_calls: 'Tool calls',
            retries: 'Retries',
            tokens: 'Tokens used',
            status: 'Status'
          },
          labels: {
            idle: 'Idle — run the agent to start',
            running: 'Running',
            done: 'Done',
            failed: 'Failed (max steps reached)',
            trace: 'Execution trace'
          }
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
            none: 'No messages yet'
          }
        },
        philosophers_sim: {
          title: 'Dining Philosophers',
          subtitle: 'Five philosophers share five forks. Eating needs both neighbouring forks, so the seats compete for the same resource. Pick a strategy and watch how it avoids — or causes — deadlock.',
          buttons: {
            configure: 'Configure',
            close_config: 'Close Config',
            start: 'Start',
            pause: 'Pause',
            step: 'Step',
            reset: 'Reset'
          },
          config: {
            title: 'Controls',
            strategy: 'Strategy',
            philosophers: 'Philosophers',
            speed: 'Speed'
          },
          strategies: {
            naive: {
              label: 'Naive',
              desc: 'Each philosopher grabs the left fork, then waits for the right one. If everyone picks up their left fork at once, all hold one fork forever — a textbook deadlock.'
            },
            hierarchy: {
              label: 'Resource Hierarchy',
              desc: 'Forks are numbered; a philosopher always acquires the lower-numbered fork first. Breaking the circular-wait condition makes deadlock impossible.'
            },
            atomic: {
              label: 'Both or Nothing',
              desc: 'A philosopher only picks up forks when both are free, atomically. Nobody ever holds a single fork, so there is no deadlock (starvation is still possible).'
            },
            arbitrator: {
              label: 'Central Arbitrator',
              desc: 'A waiter lets at most N-1 philosophers reach for forks at the same time. With one seat always free, the circular wait can never close.'
            }
          },
          states: {
            thinking: 'Thinking',
            hungry: 'Hungry',
            eating: 'Eating'
          },
          viz: {
            title: 'The Table',
            tick: 'tick',
            eating_now: 'eating',
            fork_held: 'Fork held',
            deadlock: 'DEADLOCK',
            deadlock_hint: 'Deadlock detected: every hungry philosopher holds one fork and waits forever for the other. Reset and try a deadlock-free strategy.'
          },
          roster: {
            title: 'Philosophers'
          },
          stats: {
            title: 'Metrics',
            total_meals: 'Total meals',
            eating: 'Eating now',
            longest_wait: 'Longest wait',
            ticks: 'Ticks',
            running: 'Running',
            paused: 'Paused',
            deadlocked: 'Deadlocked',
            meals_short: '{{n}} meals'
          },
          log: {
            title: 'Event Log',
            empty: 'Waiting for events…',
            got_hungry: '{{name}} got hungry',
            took_left: '{{name}} picked up the left fork',
            took_right: '{{name}} picked up the right fork',
            took_low: '{{name}} picked up fork {{fork}}',
            started_eating: '{{name}} grabbed both forks and started eating',
            finished_eating: '{{name}} finished eating and released the forks',
            deadlock_detected: 'Deadlock detected — no philosopher can make progress'
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
          buttons: {
            settings: 'Settings',
            start: 'Start Simulation',
            simulating: 'Simulating...'
          },
          settings: {
            title: 'Simulation Settings',
            max_retries: 'Max Retries: {{value}}',
            base_delay: 'Base Delay: {{ms}}ms',
            success_rate: 'Success Rate: {{percent}}%'
          },
          toggles: {
            use_exponential_backoff: 'Use Exponential Backoff',
            add_jitter: 'Add Jitter'
          },
          visualization: {
            title: 'Visualization'
          },
          attempt: {
            label: 'Attempt {{id}}',
            next_in: 'Next attempt in {{ms}}ms'
          },
          stats: {
            title: 'Statistics',
            total_attempts: 'Total Attempts',
            final_status: 'Final Status',
            status_success: 'Success',
            status_failure: 'Failure'
          },
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
          buttons: {
            configure: 'Configure',
            close_config: 'Close Config',
            reset: 'Reset'
          },
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
          messages: {
            processing: 'Processing request...'
          },
          history: {
            title: 'Request History:',
            cache_hit: 'Cache Hit'
          },
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
          rules: {
            title: 'Firewall Rules',
            restore_title: 'Restore initial configuration',
            add_rule: 'Add Rule',
            remove_rule_title: 'Remove rule'
          },
          stats: {
            title: 'Statistics',
            total: 'Total Packets',
            allowed: 'Allowed',
            blocked: 'Blocked'
          },
          traffic: {
            title: 'Network Traffic',
            custom_packet: 'Custom Packet',
            generate_packet: 'Generate Packet',
            stop_autogen: 'Stop',
            start_autogen: 'Auto Generate'
          },
          labels: {
            port: 'Port',
            protocol: 'Protocol',
            type: 'Type',
            payload: 'Payload',
            action_allow: 'Allow',
            action_block: 'Block'
          },
          badges: {
            allow: 'ALLOWED',
            block: 'BLOCKED'
          },
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
          buttons: {
            downgrade: 'Downgrade',
            upgrade: 'Upgrade',
            start: 'Start Simulation',
            stop: 'Stop Simulation'
          },
          resources: {
            cpu: 'CPU ({{cores}} cores)',
            memory: 'Memory ({{gb}} GB)',
            storage: 'Storage ({{gb}} GB)'
          },
          queue_title: 'Request Queue',
          controls_title: 'Controls',
          request_rate: 'Request Rate ({{rate}}/s)',
          stats_title: 'Statistics',
          processed: 'Processed',
          rejected: 'Rejected',
          success_rate: 'Success Rate',
          uptime: 'Uptime',
          total_cost: 'Total Cost',
          current_load: 'Current Load',
          statuses: {
            healthy: 'healthy',
            degraded: 'degraded',
            failed: 'failed',
            role: 'Role',
            data: 'Data',
            keys: 'keys',
            replicated_after: 'Replicated after {{seconds}}s'
          },
          upgrade_modal: {
            title: 'Upgrade Server',
            text: 'Are you sure you want to upgrade to {{tier}}? This will increase your costs to ${{cost}}/month.',
            cancel: 'Cancel',
            confirm: 'Upgrade'
          }
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
          strong: 'Strong',
          eventual: 'Eventual',
          network_latency_ms: 'Network Latency (ms)',
          failure_rate: 'Failure Rate',
          auto_failover: 'Auto Failover',
          manual_title: 'Manual Operation',
          read: 'Read',
          write: 'Write',
          key_placeholder: 'Key',
          value_placeholder: 'Value',
          execute: 'Execute',
          start: 'Start Simulation',
          stop: 'Stop Simulation',
          role: 'Role',
          latency: 'Latency',
          data: 'Data',
          keys_label: '{{count}} keys',
          replicated_after: 'Replicated after {{seconds}}s',
          simulate_failure: 'Simulate Failure',
          recover: 'Recover',
          recent_requests: 'Recent Requests',
          read_label: 'Read',
          write_label: 'Write'
        },
        timeout: {
          title: 'Timeout Simulator',
          buttons: {
            settings: 'Settings',
            start: 'Start',
            stop: 'Stop',
            reset: 'Reset'
          },
          settings: {
            title: 'Simulation Settings',
            timeout: 'Timeout: {{seconds}}s',
            rps: 'Requests per Second: {{value}}',
            min_response: 'Minimum Response Time: {{seconds}}s',
            max_response: 'Maximum Response Time: {{seconds}}s',
            success_rate: 'Success Rate: {{percent}}%'
          },
          visualization: {
            title: 'Visualization'
          },
          request_label: 'Request {{id}}',
          statuses: {
            success: 'Request completed successfully',
            timeout: 'Timeout: Request exceeded {{seconds}}s',
            error: 'Server error'
          },
          stats: {
            title: 'Statistics',
            total: 'Total Requests',
            timeouts: 'Timeouts'
          },
          info: {
            title: 'Explanation',
            p1: 'This simulator demonstrates how the timeout mechanism works in distributed systems. Each request has a configurable timeout to be completed.',
            p2: 'If the response does not arrive within the timeout, the request is canceled and a timeout error is returned, preventing resources from being stuck indefinitely.',
            p3: 'Adjust timeout, response times, and success rate to visualize impacts.'
          }
        },
        event_sourcing: {
          title: 'Event Sourcing Simulator',
          buttons: {
            settings: 'Settings',
            reset: 'Reset',
            replay: 'Replay'
          },
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
            speed_opts: {
              half: '0.5s',
              one: '1s',
              two: '2s'
            }
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
      design_principles: {
        consistency_strategies: {
          consensus_simulator: {
            controls: {
              protocol_label: 'Protocol:',
              options: {
                raft: 'Raft',
                paxos: 'Paxos',
                zookeeper: 'ZooKeeper'
              },
              start: 'Start',
              pause: 'Pause',
              restart: 'Restart',
              speed_label: 'Speed:',
              speed_opts: {
                slow: 'Slow',
                normal: 'Normal',
                fast: 'Fast'
              },
              show_explanations: 'Show Explanations',
              hide_explanations: 'Hide Explanations'
            },
            step_prefix: 'Step',
            cluster_vis_title: 'Cluster Visualization',
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
          lamport_timestamps_simulator: {
            title: 'Lamport Timestamps Simulator',
            subtitle: 'Visualize how logical timestamps are updated in a distributed system',
            info: 'Add local events or send messages between processes to see how Lamport timestamps are updated. Observe how event ordering is preserved through logical clocks.',
            controls: {
              reset: 'Reset Simulation'
            },
            process_label: 'Process {{n}}',
            buttons: {
              local_event: 'Local Event',
              send_to: '→ {{target}}'
            },
            timeline: {
              clock_prefix: 't = '
            },
            event_labels: {
              local: 'Local Event',
              send_prefix: '→ {{target}}',
              receive_prefix: '← {{source}}'
            },
            legend: {
              title: 'Legend',
              local: 'Local Event',
              sent: 'Message Sent',
              received: 'Message Received'
            }
          }
        },
        two_phase_commit_simulator: {
          title: 'Two-Phase Commit Simulator',
          intro: 'This simulator demonstrates the Two-Phase Commit protocol in a distributed bank transfer. Configure bank responses by clicking them before starting the simulation.',
          controls: {
            start: 'Start',
            pause: 'Pause',
            simulation: 'Simulation',
            reset: 'Reset',
            speed_label: 'Speed:',
            speed_opts: {
              slow: 'Slow',
              normal: 'Normal',
              fast: 'Fast'
            }
          },
          nodes: {
            coordinator: 'Coordinator',
            bank_n: 'Bank {{n}}'
          },
          node_states: {
            idle: 'idle',
            preparing: 'preparing',
            prepared: 'prepared',
            committed: 'committed',
            aborted: 'aborted'
          },
          responses: {
            yes: 'yes',
            no: 'no'
          },
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
            s1: 'Phase 1: Coordinator sent \'prepare\' to all participants',
            s2: 'Phase 1: Participants replied with their votes',
            s3: 'Phase 2: Coordinator made the final decision',
            s4: 'Simulation finished! You can reset to run again.'
          }
        },
        algorithms: {
          title: 'Synchronization Algorithms',
          intro: 'There are several algorithms to ensure synchronization in distributed systems. Each has specific characteristics and ideal use cases.',
          key_concept_label: 'Key Concept',
          key_concept_text: 'The choice of synchronization algorithm depends on factors such as number of nodes, network latency, fault tolerance, and performance requirements.',
          bakery: {
            title: 'Bakery Algorithm',
            concept_title: 'Concept',
            concept_p: 'Based on a bakery where each customer receives a ticket number and is served in increasing order.',
            badges: {
              total_order: 'Total Order',
              fairness: 'Fairness'
            },
            demo_title: 'Interactive Demo',
            labels: {
              process: 'Process',
              ticket: 'Ticket',
              request_access: 'Request Access'
            }
          },
          token_ring: {
            title: 'Token Ring',
            concept_title: 'Concept',
            concept_p: 'A token circulates among processes in a logical ring, and only the process holding the token can access shared resources.',
            badges: {
              single_token: 'Single Token',
              circular_passing: 'Circular Passing'
            },
            demo_title: 'Interactive Demo',
            move_token: 'Move Token',
            labels: {
              process_prefix: 'P'
            }
          },
          ricart_agrawala: {
            title: 'Ricart-Agrawala',
            concept_title: 'Concept',
            concept_p: 'Based on logical timestamps, where processes request permission from all others before accessing shared resources.',
            badges: {
              timestamps: 'Timestamps',
              consensus: 'Consensus'
            },
            demo_title: 'Interactive Demo',
            labels: {
              process: 'Process',
              request_access: 'Request Access',
              ts_prefix: 'TS'
            }
          },
          comparison: {
            title: 'Comparison',
            bakery_title: 'Bakery Algorithm',
            token_ring_title: 'Token Ring',
            ricart_title: 'Ricart-Agrawala',
            advantages: 'Advantages',
            disadvantages: 'Disadvantages',
            bakery: {
              pros: 'Simple and fair',
              cons: 'High message complexity'
            },
            token_ring: {
              pros: 'Low message complexity',
              cons: 'Single point of failure'
            },
            ricart: {
              pros: 'Fault tolerant',
              cons: 'High latency'
            }
          }
        },
        availability: {
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
        }
      },
      service_oriented: {
        title: 'Service-Oriented Design',
        intro: 'Explore different approaches for organizing services and their practical implications. Each architecture has its own trade-offs and ideal use cases.',
        sections: {
          advantages: 'Advantages',
          disadvantages: 'Disadvantages',
          example_title: 'Practical Example',
          diagram_title: 'Architecture Visualization',
          legend: {
            direct_call: 'Direct call',
            interface: 'Interface',
            api_events: 'API/Events'
          },
          module_labels: {
            deploy: 'Deploy',
            communication: 'Communication',
            database: 'Database'
          }
        }
      },
      monitoring_maintenance: {
        logs: {
          title: 'Logs and Tracing in Distributed Systems',
          intro_p1: 'Logs and tracing are essential to understand behavior, debug issues, and maintain observability. They provide detailed insights into execution flow and system state.',
          key_concept_label: 'Key Concept',
          key_concept_text: 'In distributed systems, logs should be treated as event streams, centralized and correlated to provide a complete system view.',
          types_title: 'Log Types',
          app_logs_title: 'Application Logs',
          app_logs_items: [
            'Business events',
            'Execution flow',
            'Errors and exceptions',
            'User actions'
          ],
          sys_logs_title: 'System Logs',
          sys_logs_items: [
            'Startup/shutdown',
            'Resource usage',
            'System events',
            'Hardware issues'
          ],
          sec_logs_title: 'Security Logs',
          sec_logs_items: [
            'Access attempts',
            'Permission changes',
            'Audit events',
            'Security alerts'
          ],
          structured_title: 'Structured Logging',
          structured_desc: 'Structured logging treats logs as data objects rather than plain text, enabling easier analysis and search.',
          benefits_title: 'Benefits',
          benefits_items: [
            {
              title: 'Searchability',
              desc: 'Enables complex searches and filters'
            },
            {
              title: 'Analysis',
              desc: 'Allows aggregations and visualizations'
            },
            {
              title: 'Standardization',
              desc: 'Consistent format across services'
            }
          ],
          example_title: 'Example',
          aggregation_title: 'Log Aggregation',
          components_title: 'Components',
          components_items: [
            {
              title: 'Collectors',
              desc: 'Agents collecting logs from different sources'
            },
            {
              title: 'Processors',
              desc: 'Filter, transform and enrich logs'
            },
            {
              title: 'Storage',
              desc: 'Distributed system for persistence'
            },
            {
              title: 'Interface',
              desc: 'UI for search and analysis'
            }
          ],
          elk_title: 'ELK Stack',
          elk_items: [
            {
              title: 'Elasticsearch',
              desc: 'Distributed storage and search for logs'
            },
            {
              title: 'Logstash',
              desc: 'Log processing pipeline'
            },
            {
              title: 'Kibana',
              desc: 'Visualization and analysis of logs'
            }
          ],
          tracing_title: 'Distributed Tracing',
          tracing_desc: 'Distributed tracing tracks a request across multiple services, providing end-to-end visibility.',
          concepts_title: 'Concepts',
          concepts_items: [
            {
              title: 'Trace',
              desc: 'Represents an end-to-end transaction'
            },
            {
              title: 'Span',
              desc: 'Unit of work within a trace'
            },
            {
              title: 'Context',
              desc: 'Metadata that propagates with the trace'
            }
          ],
          tools_title: 'Tools',
          tools_items: [
            {
              title: 'Jaeger',
              desc: 'Open-source distributed tracing system'
            },
            {
              title: 'Zipkin',
              desc: 'Focused on latency and dependency analysis'
            },
            {
              title: 'OpenTelemetry',
              desc: 'Open standard for instrumentation'
            }
          ],
          best_practices_title: 'Best Practices',
          logging_title: 'Logging',
          logging_items: [
            {
              title: 'Appropriate Levels',
              desc: 'Use appropriate log levels (ERROR, WARN, INFO, DEBUG)'
            },
            {
              title: 'Context',
              desc: 'Include relevant information for debugging'
            },
            {
              title: 'Sensitivity',
              desc: 'Avoid sensitive data in logs'
            }
          ],
          tracing_bp_title: 'Tracing',
          tracing_bp_items: [
            {
              title: 'Sampling',
              desc: 'Configure appropriate sampling rates'
            },
            {
              title: 'Instrumentation',
              desc: 'Use standard instrumentation libraries'
            },
            {
              title: 'Correlation',
              desc: 'Keep correlation between logs and traces'
            }
          ]
        },
        logs_page: {
          title: 'Logs and Tracing in Distributed Systems',
          intro_p1: 'In distributed systems, logs and tracing are fundamental for monitoring, debugging, and performance analysis. This section explores best practices and tools to implement a robust observability system.',
          buttons: {
            logs_simulator: 'Logs Simulator',
            tracing_simulator: 'Tracing Simulator'
          },
          levels_title: 'Log Levels',
          levels: {
            debug_desc: 'Detailed information for debugging',
            info_desc: 'Normal system events',
            warn_desc: 'Warnings about unexpected situations',
            error_desc: 'Errors that need attention'
          },
          formats: {
            text_title: 'Plain Text Logs',
            text_adv_title: 'Advantages',
            text_adv_items: [
              'Easy for humans to read',
              'Lower processing overhead',
              'Compatible with legacy tools',
              'Smaller file size'
            ],
            text_disadv_title: 'Disadvantages',
            text_disadv_items: [
              'Hard to parse programmatically',
              'Lack of clear structure',
              'Hard to add metadata',
              'Prone to formatting errors'
            ],
            json_title: 'JSON Logs',
            json_adv_title: 'Advantages',
            json_adv_items: [
              'Clear and consistent structure',
              'Easy to parse and process',
              'Supports rich metadata',
              'Better for automated analysis'
            ],
            json_disadv_title: 'Disadvantages',
            json_disadv_items: [
              'Higher processing overhead',
              'Larger log files',
              'Less human-readable',
              'Can be excessive for simple logs'
            ]
          },
          tracing_section: {
            title: 'Distributed Tracing',
            what_is_title: 'What is Tracing?',
            what_is_p: 'Tracing tracks the path of a request across multiple services in a distributed system. Each request receives a unique ID (traceId) that is propagated across services.',
            components_title: 'Main Components',
            components_items: [
              'TraceId: unique request identifier',
              'SpanId: identifier for each operation',
              'ParentSpanId: parent-child relationship',
              'Tags: additional metadata',
              'Timestamps: operation durations'
            ],
            benefits_title: 'Benefits',
            benefits_items: [
              'Visualization of request flows',
              'Bottleneck identification',
              'Debugging distributed systems',
              'Performance analysis',
              'Event correlation'
            ]
          },
          best_practices: {
            title: 'Best Practices',
            logging_title: 'Logging',
            logging_items: [
              'Use appropriate log levels',
              'Include relevant context',
              'Keep a consistent format',
              'Avoid sensitive logs',
              'Use correlation IDs',
              'Include timestamps',
              'Structure metadata',
              'Implement log rotation'
            ],
            tracing_title: 'Tracing',
            tracing_items: [
              'Propagate traceId across services',
              'Use spans for key operations',
              'Add relevant tags',
              'Keep spans concise',
              'Implement sampling',
              'Configure proper retention',
              'Integrate with analysis tools',
              'Monitor tracing overhead'
            ]
          },
          tools: {
            title: 'Popular Tools',
            logging_title: 'Logging',
            logging_items: [
              'ELK Stack (Elasticsearch, Logstash, Kibana)',
              'Graylog',
              'Loki',
              'Datadog',
              'New Relic',
              'Splunk'
            ],
            tracing_title: 'Tracing',
            tracing_items: [
              'Jaeger',
              'Zipkin',
              'OpenTelemetry',
              'Datadog APM',
              'New Relic APM',
              'Lightstep'
            ]
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
        }
      },
      security: {
        title: 'Security in Distributed Systems'
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
      }
    }
  },
  pt: {
    translation: {
      admin: {
        control_center: 'Central de Controle',
        access_denied: 'Acesso Negado',
        hub: {
          title: 'Central de Controle Admin',
          subtitle: 'Tudo que você pode gerenciar, em um só lugar.'
        },
        sections: {
          content: 'Conteúdo e Aprendizado',
          community: 'Comunidade',
          system: 'Pessoas e Sistema'
        },
        cards: {
          organize: {
            title: 'Organizar Conteúdo',
            description: 'Arraste e solte módulos e lições para aninhar, reordenar e reatribuir.'
          },
          content: {
            title: 'Páginas de Conteúdo',
            description: 'Crie e edite lições MDX, títulos e simuladores por idioma.'
          },
          modules: {
            title: 'Módulos',
            description: 'Defina módulos de aprendizado, níveis e caminhos base.'
          },
          challenges: {
            title: 'Desafios',
            description: 'Gerencie desafios de system design e suas soluções.'
          },
          quizzes: {
            title: 'Quizzes',
            description: 'Crie quizzes, perguntas e temas.'
          },
          game: {
            title: 'Modo Jogo',
            description: 'Configure experiências de aprendizado gamificadas.'
          },
          forum_categories: {
            title: 'Categorias do Fórum',
            description: 'Organize as categorias de discussão do fórum da comunidade.'
          },
          notifications: {
            title: 'Notificações',
            description: 'Envie comunicados e gerencie notificações.'
          },
          users: {
            title: 'Usuários',
            description: 'Veja usuários e detalhes de conta.'
          },
          roles: {
            title: 'Funções',
            description: 'Gerencie funções e atribuições de permissão.'
          },
          analytics: {
            title: 'Análises',
            description: 'Métricas da plataforma, crescimento e gráficos de engajamento.'
          },
          settings: {
            title: 'Configurações',
            description: 'Configuração global da plataforma.'
          }
        }
      },
      command_center: {
        title: 'Painel',
        session_active: 'Ativo',
        operator: 'Bem-vindo,',
        readiness_suffix: '— {{pct}}% concluído',
        quick_jump: 'Acesso rápido',
        modules_cleared: 'Módulos concluídos',
        readiness: 'Progresso',
        progress_overview: 'Visão geral do progresso',
        ring_complete: 'concluído',
        stat_lessons: 'Lições',
        stat_in_progress: 'Em andamento',
        coins_label: 'DinaCoins',
        greeting_subtitle: 'Continue de onde você parou.',
        operation_activity: 'A seguir',
        recommended_next: 'Recomendado a seguir',
        deploy: 'Começar',
        all_cleared: 'Todas as lições concluídas',
        all_cleared_sub: 'Todos os módulos foram concluídos. Revise um tópico ou entre na Arena de Prática.',
        modules_empty: 'Nenhum módulo ainda — o conteúdo está carregando ou não há módulos disponíveis.',
        activity_empty_sub: 'Seja o primeiro a iniciar uma discussão no fórum.',
        mission_table: 'Módulos',
        col_operation: 'Módulo',
        col_priority: 'Nível',
        col_progress: 'Progresso',
        col_status: 'Status',
        activity_feed: 'Atividade recente',
        view_all: 'Ver tudo',
        no_transmissions: 'Nenhuma atividade recente',
        replies: '{{count}} respostas',
        search_placeholder: 'Buscar lições...',
        search_aria: 'Buscar lições',
        no_matches: 'Nenhum resultado',
        time_now: 'agora',
        action_review: 'Revisar',
        action_resume: 'Continuar',
        action_start: 'Começar',
        tier: {
          foundational: 'Fundamental',
          core: 'Essencial',
          advanced: 'Avançado',
          applied: 'Aplicado'
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
          tools: 'Ferramentas e Comunidade',
          practice: 'Arena de Prática'
        }
      },
      quick_access: {
        title: 'ACESSO RÁPIDO',
        command_center: 'Centro de Comando',
        roadmap: 'Roteiro',
        editor: 'Editor de Sistemas',
        forum: 'Fórum',
        preferences: 'Preferências'
      },
      common: {
        start_now: 'Começar Agora',
        view_content: 'Ver Conteúdo',
        free_editor: 'Editor Gratuito!',
        access_free_editor: 'Experimente o Editor de Sistemas Distribuídos totalmente grátis, sem cadastro!',
        loading: 'Carregando o roadmap...'
      },
      footer: {
        all_rights_reserved: 'Todos os direitos reservados.',
        privacy_policy: 'Política de Privacidade',
        terms: 'Termos de Serviço',
        open_source: 'Código aberto'
      },
      protected_route: {
        loading: 'Carregando...'
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
        coming_soon: 'Em breve'
      },
      content: {
        mark_complete: 'Marcar como concluído',
        completed_label: 'Concluído',
        reading_time: '{{minutes}} min de leitura'
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
      preferences: {
        title: 'Preferências',
        account_info: 'Informações da Conta',
        email: 'Email',
        creation_date: 'Data de Inscrição',
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
              'Recursos de comunidade e acompanhamento de progresso'
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
          ip_rights: {
            title: '4. Propriedade Intelectual e Atribuição',
            intro: 'Todo o conteúdo educacional do Serviço é gratuito para acessar, estudar e compartilhar. Pedimos apenas uma coisa em troca: sempre dê os créditos à plataforma. Sempre que você usar, referenciar ou reproduzir nosso conteúdo — incluindo em vídeos, cursos, aulas, apresentações, artigos, redes sociais ou qualquer outro meio — você deve:',
            items: [
              'Dar crédito claro e visível ao Dinamos (trilhainfo) como fonte do conteúdo',
              'Incluir um link para a plataforma (https://instagram.com/trilhainfo) sempre que o meio permitir',
              'Manter intactos os avisos de direitos autorais, marca ou autoria',
              'Não apresentar nosso conteúdo como se fosse seu nem sugerir endosso, parceria ou afiliação oficial sem permissão'
            ]
          },
          conduct: {
            title: '5. Conduta do Usuário',
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
            title: '6. Disponibilidade do Serviço',
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
            title: '7. Privacidade e Proteção de Dados',
            paragraphs: [
              'Sua privacidade é importante. A coleta e uso de informações pessoais são regidos por nossa Política de Privacidade, incorporada por referência.',
              'Ao usar o Serviço, você consente com nossas práticas de dados conforme descritas na Política de Privacidade.'
            ]
          },
          disclaimer: {
            title: '8. Isenção de Garantias',
            intro: 'O Serviço é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo, incluindo:',
            items: [
              'Comercialização ou adequação a um propósito específico',
              'Não violação de direitos de terceiros',
              'Precisão, completude ou confiabilidade do conteúdo',
              'Operação ininterrupta ou livre de erros'
            ]
          },
          liability: {
            title: '9. Limitação de Responsabilidade',
            intro: 'Na máxima extensão permitida por lei, o Dinamos não é responsável por danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo:',
            items: [
              'Perda de lucros, dados ou outros prejuízos intangíveis',
              'Danos decorrentes do uso ou impossibilidade de uso do Serviço',
              'Danos decorrentes de acesso não autorizado aos seus dados'
            ],
            note: 'A responsabilidade total é limitada ao valor pago pelo Serviço nos 12 meses anteriores à reclamação.'
          },
          indemnification: {
            title: '10. Indenização',
            intro: 'Você concorda em indenizar e isentar o Dinamos de reivindicações, danos, perdas ou despesas decorrentes de:',
            items: [
              'Seu uso do Serviço',
              'Sua violação destes Termos',
              'Sua violação de direitos de terceiros',
              'Conteúdo que você enviar ou compartilhar pelo Serviço'
            ]
          },
          termination: {
            title: '11. Rescisão',
            intro: 'Podemos encerrar ou suspender sua conta e acesso imediatamente, sem aviso, por motivos como:',
            items: [
              'Violação destes Termos',
              'Atividade fraudulenta ou ilegal',
              'Períodos prolongados de inatividade'
            ],
            note: 'Com a rescisão, seu direito de usar o Serviço cessa imediatamente; disposições sobre propriedade intelectual, isenções e limitações permanecem vigentes.'
          },
          governing_law: {
            title: '12. Legislação Aplicável',
            paragraphs: [
              'Estes Termos são regidos pelas leis do Brasil, sem considerar conflitos de leis.',
              'Disputas estão sujeitas à jurisdição exclusiva dos tribunais do Brasil.'
            ]
          },
          changes: {
            title: '13. Alterações nos Termos',
            intro: 'Podemos modificar estes Termos a qualquer momento. Em caso de mudanças materiais, notificaremos você por:',
            items: [
              'Publicação dos Termos atualizados nesta página',
              'Atualização da data de "Última atualização"',
              'Envio de aviso por e-mail ou pelo Serviço'
            ],
            note: 'O uso contínuo após as alterações constitui aceitação dos novos Termos.'
          },
          contact: {
            title: '14. Informações de Contato',
            intro: 'Se tiver dúvidas sobre estes Termos, entre em contato:',
            items: [
              'Email: flavio@trilha.info',
              'Através do formulário de contato no site'
            ]
          },
          severability: {
            title: '15. Divisibilidade',
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
      landing: {
        hero_title: 'Domine Sistemas Distribuídos na Prática',
        hero_subtitle: 'A plataforma mais completa para aprender arquitetura de sistemas com simuladores interativos e casos reais',
        hero_eyebrow: 'Plataforma de aprendizado de sistemas distribuídos',
        header_signin: 'Entrar',
        hero_explore: 'Explorar o conteúdo',
        hero_trust: 'Grátis para sempre · Sem cartão de crédito · Login com 1 clique',
        signin_title: 'Entre para começar a aprender',
        signin_subtitle: 'Acompanhe seu progresso, use todos os simuladores e participe da comunidade — em um clique.',
        stat_simulators_value: '15+',
        stat_simulators_label: 'Simuladores interativos',
        stat_cases_value: '6',
        stat_cases_label: 'Estudos de caso reais',
        stat_scale_value: '1.5B+',
        stat_scale_label: 'Requisições / ano analisadas',
        stat_price_value: 'R$0',
        stat_price_label: 'Custo, para sempre',
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
        free_badge: 'GRÁTIS',
        free_title: 'Acesso Totalmente Gratuito',
        free_subtitle: 'Todo o conteúdo disponível sem custo. Aprenda sistemas distribuídos sem barreiras.',
        free_price: 'GRÁTIS',
        free_description: 'Acesso completo a todo conteúdo, simuladores e casos reais. Sem necessidade de cartão de crédito.',
        cta_free_title: 'Comece a Aprender Hoje!',
        cta_free_subtitle: 'Acesso completo a todo o conteúdo, 100% grátis.',
        open_source_label: 'Código aberto',
        open_source_title: 'Construído à vista de todos',
        open_source_subtitle: 'O Dinamos é gratuito e totalmente open source. Leia o código, abra uma issue ou envie um pull request. Toda a plataforma vive no GitHub.',
        open_source_cta: 'Ver no GitHub',
        open_source_contribute: 'Contribuições são bem-vindas',
        scroll_hint: 'Role para explorar',
        hero_uptime: '99,99% de disponibilidade',
        stats_label: 'Em números',
        topology_label: 'Sistema ao vivo',
        topology_title: 'Acompanhe uma requisição pela arquitetura',
        topology_subtitle: 'Do cliente ao balanceador, aos nós, ao cache e ao banco — cada salto aqui é algo que você pode abrir, executar e quebrar em um simulador.',
        topology_node_client: 'cliente',
        topology_node_lb: 'balanceador',
        topology_node_cache: 'cache',
        topology_node_db: 'banco de dados',
        topology_card1_title: 'Balanceamento de carga',
        topology_card1_text: 'Distribua o tráfego entre nós saudáveis e veja o roteamento se adaptar conforme instâncias entram e saem.',
        topology_card2_title: 'Cache',
        topology_card2_text: 'Reduza a latência e proteja seu banco servindo leituras quentes direto da memória.',
        topology_card3_title: 'Resiliência',
        topology_card3_text: 'Circuit breakers, timeouts e retries impedem que uma única falha vire um efeito cascata.',
        topology_card4_title: 'Replicação',
        topology_card4_text: 'Replique o estado entre regiões e raciocine sobre os trade-offs reais de consistência.',
        features_label: 'O que você aprende',
        showcase_label: 'Dentro do laboratório',
        journey_label: 'Trilha',
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
            consistency: {
              description: 'Todos os nós veem os mesmos dados ao mesmo tempo. Toda leitura recebe a escrita mais recente ou um erro.'
            },
            availability: {
              description: 'O sistema permanece operacional 100% do tempo. Toda requisição recebe uma resposta.'
            },
            partition_tolerance: {
              description: 'O sistema continua operando apesar de falhas de rede entre os nós.'
            },
            cp_systems: {
              description: 'Priorizam consistência de dados sobre disponibilidade durante partições de rede'
            },
            ap_systems: {
              description: 'Priorizam disponibilidade do sistema sobre consistência imediata durante partições'
            },
            ca_systems: {
              description: 'Sistemas tradicionais que sacrificam tolerância a partições'
            }
          },
          consistency_models: {
            name: 'Modelos de Consistência',
            description: 'Padrões de consistência forte, eventual e fraca',
            strong_consistency: {
              description: 'Todos os nós veem os mesmos dados ao mesmo tempo. Após uma operação de escrita, todas as leituras subsequentes retornarão o valor atualizado.'
            },
            eventual_consistency: {
              description: 'O sistema se tornará consistente com o tempo, desde que não receba novas atualizações. Leituras podem retornar dados obsoletos temporariamente.'
            },
            weak_consistency: {
              description: 'Após uma escrita, leituras podem ou não ver o valor atualizado. O sistema não faz garantias sobre quando os dados estarão consistentes.'
            }
          },
          distributed_challenges: {
            name: 'Desafios Distribuídos',
            description: 'Problemas comuns em sistemas distribuídos',
            network_partitions: {
              description: 'Falhas de rede que dividem o sistema em grupos isolados, forçando trade-offs entre consistência e disponibilidade.'
            },
            clock_sync: {
              description: 'Diferentes nós têm relógios diferentes, dificultando ordenar eventos e manter consistência.'
            },
            partial_failures: {
              description: 'Algumas partes do sistema falham enquanto outras continuam funcionando, criando estados inconsistentes.'
            },
            consensus: {
              description: 'Fazer nós distribuídos concordarem com um único valor ou decisão na presença de falhas.'
            },
            state_management: {
              description: 'Manter controle do estado do sistema em múltiplos nós ao lidar com atualizações concorrentes.'
            },
            race_conditions: {
              description: 'Múltiplos processos acessando recursos compartilhados simultaneamente, levando a resultados imprevisíveis.'
            }
          },
          network_partitions: {
            name: 'Partições de Rede e Falhas',
            description: 'Lidando com divisões de rede e falhas de nós',
            what_is: {
              description: 'Uma partição de rede ocorre quando a rede entre nós falha, dividindo o sistema em grupos isolados que não conseguem se comunicar.'
            },
            causes: {
              description: 'Partições de rede podem surgir de várias questões de infraestrutura e configuração que afetam a conectividade entre nós distribuídos.'
            },
            failure_types: {
              description: 'Diferentes modos de falha requerem diferentes estratégias de detecção e tratamento em sistemas distribuídos.',
              fail_stop: {
                description: 'Nó para completamente e outros nós podem detectar a falha'
              },
              fail_slow: {
                description: 'Nó fica muito lento mas não falha completamente'
              },
              byzantine: {
                description: 'Nó se comporta arbitrariamente ou maliciosamente'
              }
            },
            partition_scenarios: {
              datacenter_split: {
                description: 'Quando datacenters perdem conectividade, cada um deve decidir como lidar com operações em andamento'
              },
              service_mesh_partition: {
                description: 'Quando serviços em uma mesh perdem conectividade com subconjuntos de outros serviços'
              },
              database_partition: {
                description: 'Quando nós de banco se tornam isolados uns dos outros'
              }
            },
            detection: {
              description: 'Detecção precoce e precisa de partições de rede é crucial para implementar estratégias de resposta apropriadas.'
            },
            prevention: {
              description: 'Embora partições não possam ser completamente prevenidas, sua probabilidade e impacto podem ser significativamente reduzidos através de design apropriado de infraestrutura.'
            },
            recovery: {
              description: 'Quando partições se curam, sistemas devem cuidadosamente reconciliar estado e resolver quaisquer conflitos que ocorreram durante a partição.'
            }
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
          canary_deployment: {
            name: 'Canary Deployment',
            description: 'Rollout gradual com divisão de tráfego e rollback instantâneo',
            simulator: {
              name: 'Simulador de Canary Deployment',
              description: 'Faça deploy de um canary, divida o tráfego e observe as métricas'
            }
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
        },
        home: {
          name: 'Design Lab',
          description: 'Resolva desafios de arquitetura com feedback de IA'
        },
        quizzes: {
          name: 'Quizzes',
          description: 'Teste seus conhecimentos e ganhe DinaCoins'
        },
        ranking: {
          name: 'Ranking',
          description: 'Classificação global da comunidade'
        },
        profile: {
          name: 'Perfil',
          description: 'Seu progresso, soluções e DinaCoins'
        },
        notifications: {
          name: 'Notificações',
          description: 'Respostas, menções e anúncios'
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
        atomic_consensus: 'Consenso Atômico'
      },
      prerequisites: {
        design_principles: 'Princípios de Design'
      },
      categories: {
        advanced: 'Avançado'
      },
      roadmap: {
        title: 'Roadmap de Aprendizado',
        description_1: 'Siga este guia estruturado para dominar os conceitos de sistemas distribuídos.',
        description_2: 'O roadmap está organizado em uma sequência lógica de aprendizado, com pré-requisitos claros e habilidades a serem desenvolvidas em cada etapa.',
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
      editor: {
        title: 'Simulador de Sistema Distribuído',
        buttons: {
          start: 'Executar',
          stop: 'Pausar',
          step: 'Passo',
          reset: 'Reiniciar',
          export: 'Exportar (.din)',
          import: 'Importar (.din)',
          arrange_vertical: 'Organizar verticalmente',
          arrange_horizontal: 'Organizar horizontalmente',
          undo: 'Desfazer (Ctrl/Cmd+Z)',
          redo: 'Refazer (Ctrl/Cmd+Shift+Z)'
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
          delete_edge: 'Excluir conexão',
          arrange_vertical: 'Organizar verticalmente',
          arrange_horizontal: 'Organizar horizontalmente'
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
          match_fixed: 'fixo na partida',
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
          dist: {
            lognormal: 'Lognormal',
            exponential: 'Exponencial',
            deterministic: 'Determinística'
          },
          strat: {
            roundRobin: 'Round Robin',
            leastConnections: 'Menos Conexões',
            weighted: 'Ponderado',
            hashing: 'Hashing Consistente'
          },
          cons: {
            strong: 'Forte',
            quorum: 'Quórum',
            eventual: 'Eventual'
          },
          shard_strat: {
            hash: 'Hash',
            range: 'Intervalo'
          }
        },
        bill: {
          title: 'Fatura {{provider}}',
          open_hint: 'Clique para ver o detalhamento de custos por produto',
          close: 'Fechar',
          empty: 'Nenhum recurso faturável ainda. Execute a simulação.',
          units: '{{count}} recurso',
          total: 'Total',
          accumulated: 'Acumulado nesta execução'
        },
        dashboard: {
          offered: 'Ofertado',
          throughput: 'Vazão',
          success: 'Sucesso',
          p95: 'p95',
          success_total: 'Reqs com sucesso',
          success_total_hint: 'Total de requisições atendidas com sucesso nesta execução',
          failed_total: 'Reqs com falha',
          failed_total_hint: 'Total de requisições com falha/descartadas nesta execução',
          in_flight: 'Em andamento',
          cost: 'Custo {{provider}}',
          error_budget: 'Orçamento de erro usado (SLO {{slo}}%)',
          chart_throughput: 'Vazão vs Ofertado (req/s)',
          chart_latency: 'Percentis de latência (ms)',
          chart_success: 'Taxa de sucesso (%) e em andamento',
          accumulated_cost: 'Custo acumulado nesta execução:',
          golden_title: 'Quatro Sinais de Ouro',
          golden: {
            latency: 'Latência',
            latency_hint: 'Quanto tempo as requisições levam',
            traffic: 'Tráfego',
            traffic_hint: 'Demanda sobre o sistema',
            errors: 'Erros',
            errors_hint: 'Requisições com falha',
            saturation: 'Saturação',
            saturation_hint: 'Carga do recurso mais ocupado'
          }
        },
        scenario: {
          preset: 'Predefinição',
          load_profile: 'Perfil de carga',
          cloud: 'Cloud',
          chaos: 'Caos',
          load: 'Carregar',
          inject: 'Injetar',
          profiles: {
            constant: 'Constante',
            ramp: 'Rampa',
            spike: 'Pico',
            diurnal: 'Diurno',
            step: 'Degrau'
          },
          chaos_types: {
            killNode: 'Matar nó',
            latencyInjection: 'Injetar latência',
            partition: 'Partição'
          },
          presets: {
            'three-tier': 'App Web de Três Camadas',
            'read-heavy-cache': 'Leitura Intensa + Cache',
            'event-driven': 'Orientado a Eventos + Fila',
            'sharded-store': 'Armazenamento Particionado',
            'microservice-mesh': 'Malha de Microsserviços',
            'url-shortener': 'Encurtador de URL',
            'ticket-booking': 'Site de Venda de Ingressos',
            'chat-messaging': 'Chat / Mensagens (WhatsApp)',
            'social-feed': 'Feed de Rede Social',
            'video-streaming': 'Streaming de Vídeo'
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
          components: 'Componentes',
          speed: 'Velocidade',
          seed: 'Semente'
        },
        errors: {
          import_error: 'Erro ao importar arquivo. Formato inválido ou corrompido.',
          read_error: 'Erro ao ler o arquivo. Tente novamente.'
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
        common: {
          simulator_title: 'Simulador Interativo'
        }
      },
      simulators: {
        consistent_hashing: {
          title: 'Simulador de Consistent Hashing',
          subtitle: 'Chaves num anel — adicione/remova nós e veja o remapeamento',
          controls: {
            vnodes: 'Nós virtuais por nó',
            keys: 'Número de chaves'
          },
          buttons: {
            add_node: 'Adicionar nó',
            remove_node: 'Remover nó',
            shuffle: 'Embaralhar chaves',
            reset: 'Resetar'
          },
          metrics: {
            title: 'Métricas ao Vivo',
            nodes: 'Nós',
            vnodes: 'Nós virtuais',
            keys: 'Chaves',
            moved: 'Chaves movidas',
            imbalance: 'Desbalanceamento'
          },
          labels: {
            node: 'Nó',
            hint: 'Adicione ou remova um nó — só as chaves destacadas se movem. Mais nós virtuais significa distribuição mais suave.'
          }
        },
        sharding: {
          title: 'Simulador de Sharding',
          subtitle: 'Roteie chaves para shards por faixa ou hash — e veja a desigualdade',
          controls: {
            shards: 'Número de shards',
            strategy: 'Estratégia',
            skew: 'Desigualdade'
          },
          strategies: {
            hash: 'Hash',
            range: 'Faixa'
          },
          buttons: {
            start: 'Iniciar',
            stop: 'Parar',
            reset: 'Resetar'
          },
          metrics: {
            title: 'Métricas ao Vivo',
            keys: 'Chaves roteadas',
            shards: 'Shards',
            imbalance: 'Desbalanceamento',
            hot_load: 'Shard mais quente'
          },
          labels: {
            shard: 'Shard',
            hint: 'Aumente a desigualdade com particionamento por faixa para criar um shard quente — depois mude para hash para equilibrar.'
          }
        },
        inverted_index: {
          title: 'Simulador de Índice Invertido',
          subtitle: 'Escolha termos de consulta e veja documentos ranqueados por pontuação',
          modes: {
            or: 'OR (qualquer termo)',
            and: 'AND (todos os termos)'
          },
          buttons: {
            clear: 'Limpar'
          },
          metrics: {
            title: 'Métricas ao Vivo',
            terms: 'Termos da consulta',
            matched: 'Docs encontrados',
            postings: 'Postings varridos',
            corpus: 'Tamanho do corpus'
          },
          labels: {
            query: 'Termos da consulta',
            documents: 'Documentos',
            index: 'Índice invertido',
            results: 'Resultados ranqueados',
            doc: 'Doc',
            score: 'pont.',
            no_matches: 'Nenhum documento correspondente',
            hint: 'AND intersecta as listas de postings; OR as une. A pontuação conta quantos termos da consulta cada documento contém.'
          }
        },
        kafka: {
          title: 'Simulador de Kafka',
          subtitle: 'Produtores, partições e um consumer group — veja o lag',
          controls: {
            partitions: 'Partições',
            consumers: 'Consumidores',
            produce_rate: 'Taxa de produção',
            consume_rate: 'Consumo / consumidor'
          },
          buttons: {
            start: 'Iniciar',
            stop: 'Parar',
            reset: 'Resetar'
          },
          metrics: {
            title: 'Métricas ao Vivo',
            produced: 'Produzidas',
            consumed: 'Consumidas',
            lag: 'Consumer lag',
            throughput: 'Capacidade de consumo'
          },
          labels: {
            partition: 'P',
            producer: 'Produtor',
            consumers: 'Consumer group',
            consumer: 'C',
            idle: 'ocioso',
            hint: 'Cada partição é lida por exatamente um consumidor. Adicione consumidores além do número de partições e eles ficam ociosos — as partições limitam o paralelismo.'
          }
        },
        saga: {
          title: 'Simulador de Saga',
          subtitle: 'Uma transação distribuída como uma sequência de passos compensáveis',
          controls: {
            mode: 'Coordenação',
            fail_at: 'Injetar falha no passo'
          },
          modes: {
            orchestrated: 'Orquestrada',
            choreographed: 'Coreografada'
          },
          fail_none: 'Nenhuma',
          buttons: {
            run: 'Rodar saga',
            reset: 'Resetar'
          },
          roles: {
            coordinator: 'Coordenador da Saga'
          },
          steps: {
            reserve: 'Reservar estoque',
            payment: 'Cobrar pagamento',
            shipping: 'Agendar envio',
            confirm: 'Enviar confirmação'
          },
          status: {
            pending: 'Pendente',
            running: 'Executando',
            done: 'Confirmado',
            failed: 'Falhou',
            compensated: 'Compensado'
          },
          metrics: {
            title: 'Resultado',
            committed: 'Passos confirmados',
            compensated: 'Passos compensados',
            outcome: 'Desfecho'
          },
          outcome: {
            idle: 'Inativo',
            committed: 'Confirmada',
            rolled_back: 'Revertida'
          },
          labels: {
            hint: 'Uma saga não tem rollback global. Quando um passo falha, cada passo concluído é desfeito por sua própria ação compensatória, em ordem reversa.'
          }
        },
        delivery_semantics: {
          title: 'Simulador de Semânticas de Entrega',
          subtitle: 'At-most-once vs at-least-once vs exactly-once',
          controls: {
            mode: 'Semântica',
            dedup: 'Deduplicação',
            dlq: 'Fila de dead-letter'
          },
          modes: {
            at_most_once: 'At-most-once',
            at_least_once: 'At-least-once',
            exactly_once: 'Exactly-once'
          },
          buttons: {
            start: 'Iniciar',
            stop: 'Parar',
            reset: 'Resetar',
            on: 'On',
            off: 'Off'
          },
          metrics: {
            title: 'Métricas ao Vivo',
            produced: 'Produzidas',
            delivered: 'Entregues',
            duplicates: 'Duplicatas',
            filtered: 'Filtradas (dedup)',
            lost: 'Perdidas',
            dlq: 'Dead-lettered'
          },
          tags: {
            delivered: 'Entregue',
            duplicate: 'Duplicata',
            lost: 'Perdida',
            dlq: 'Dead-letter',
            filtered: 'Filtrada'
          },
          labels: {
            recent: 'Mensagens recentes',
            empty: 'Nenhuma mensagem ainda',
            hint: 'At-most-once pode perder mensagens; at-least-once pode duplicá-las. "Exactly-once" = entrega at-least-once mais deduplicação no consumidor.'
          }
        },
        cqrs: {
          title: 'Simulador de CQRS',
          subtitle: 'Comandos anexam eventos; read models são projeções',
          controls: {
            lag: 'Lag da projeção'
          },
          commands: {
            create: 'Criar pedido',
            add_item: 'Adicionar item',
            ship: 'Enviar pedido',
            cancel: 'Cancelar pedido'
          },
          buttons: {
            reset: 'Resetar'
          },
          panels: {
            command: 'Lado de comando (escrita)',
            log: 'Log de eventos',
            read: 'Read models (consulta)'
          },
          events: {
            created: 'OrderCreated',
            item_added: 'ItemAdded',
            shipped: 'OrderShipped',
            cancelled: 'OrderCancelled'
          },
          read: {
            status: 'Status do pedido',
            items: 'Quantidade de itens',
            events_applied: 'Eventos aplicados',
            pending: 'Pendentes'
          },
          status_values: {
            none: '—',
            created: 'Criado',
            shipped: 'Enviado',
            cancelled: 'Cancelado'
          },
          labels: {
            log_empty: 'Nenhum evento ainda — emita um comando',
            lag_caption: 'Projeção atualizada: {{pct}}%',
            hint: 'Escritas vão para o log de eventos instantaneamente; read models atualizam de forma assíncrona. Aumente o lag para ver consistência eventual — a leitura fica atrás da escrita.'
          }
        },
        inference_batching: {
          title: 'Simulador de Batching de Inferência',
          subtitle: 'Continuous batching em uma GPU — vazão vs latência',
          controls: {
            arrival_rate: 'Taxa de chegada (req/s)',
            batch_capacity: 'Capacidade do lote (slots KV)',
            output_tokens: 'Média de tokens de saída'
          },
          buttons: {
            start: 'Iniciar',
            stop: 'Parar',
            reset: 'Reiniciar'
          },
          panels: {
            batch: 'Lote em Execução (GPU)',
            queue: 'Fila de Admissão',
            metrics: 'Métricas ao Vivo'
          },
          metrics: {
            throughput: 'Vazão (tok/s)',
            utilization: 'Utilização do lote',
            queue_depth: 'Tamanho da fila',
            avg_latency: 'Latência média',
            completed: 'Concluídas',
            dropped: 'Descartadas'
          },
          labels: {
            slot_free: 'slot livre',
            tokens: 'tok',
            waiting: 'esperando',
            batch_empty: 'GPU ociosa — nenhuma requisição no lote',
            queue_empty: 'Fila vazia',
            request: 'REQ'
          }
        },
        rag_pipeline: {
          title: 'Simulador de Pipeline RAG',
          subtitle: 'Embeddar → buscar → reordenar → montar → gerar',
          controls: {
            chunk_size: 'Tamanho do trecho (tokens)',
            top_k: 'Recuperar top-K',
            rerank: 'Reordenação'
          },
          buttons: {
            run: 'Executar Consulta',
            reset: 'Reiniciar',
            on: 'Ligado',
            off: 'Desligado'
          },
          stages: {
            embed: 'Embeddar Consulta',
            search: 'Busca Vetorial',
            rerank: 'Reordenar',
            assemble: 'Montar Contexto',
            generate: 'Gerar'
          },
          metrics: {
            recall: 'Recall da recuperação',
            latency: 'Latência total',
            cost: 'Custo / consulta',
            context: 'Contexto usado',
            quality: 'Qualidade da resposta'
          },
          labels: {
            idle: 'Ocioso — execute uma consulta para começar',
            chunk: 'trecho',
            score: 'score',
            retrieved: 'Trechos recuperados',
            disabled: 'desativado'
          }
        },
        vector_search: {
          title: 'Simulador de Busca Vetorial',
          subtitle: 'Vizinhos mais próximos aproximados com HNSW',
          controls: {
            ef_search: 'efSearch (lista de candidatos)',
            m_links: 'M (conexões do grafo)',
            dataset: 'Tamanho do dataset'
          },
          buttons: {
            search: 'Executar Busca',
            reset: 'Reiniciar'
          },
          metrics: {
            recall: 'Recall@10',
            latency: 'Latência da consulta',
            comparisons: 'Comp. de distância',
            memory: 'Memória do índice'
          },
          labels: {
            idle: 'Execute uma busca para sondar o índice',
            exact: 'Exata (força bruta)',
            approx: 'HNSW (aproximada)',
            found: 'Vizinhos encontrados'
          }
        },
        llm_gateway: {
          title: 'Simulador de Gateway de LLM',
          subtitle: 'Cache semântico, fallback de modelo, limite de taxa e custo',
          controls: {
            cache_rate: 'Taxa de acerto do cache (%)',
            rate_limit: 'Limite de taxa (req/s)',
            primary_fail: 'Falha do primário (%)'
          },
          buttons: {
            start: 'Iniciar',
            stop: 'Parar',
            reset: 'Reiniciar'
          },
          routes: {
            cache: 'Servido do cache',
            primary: 'Modelo primário',
            fallback: 'Modelo de fallback',
            rejected: 'Limitado por taxa'
          },
          metrics: {
            served: 'Atendidas',
            cache_hits: 'Acertos de cache',
            fallbacks: 'Fallbacks',
            rejected: 'Rejeitadas',
            cost: 'Custo total'
          },
          labels: {
            recent: 'Requisições recentes',
            empty: 'Nenhuma requisição ainda'
          }
        },
        gpu_autoscaler: {
          title: 'Simulador de Autoescalonador de GPU',
          subtitle: 'Partidas a frio, filas e escala-a-zero',
          controls: {
            arrival_rate: 'Taxa de chegada (req/s)',
            scale_threshold: 'Limiar de fila para escalar',
            cold_start: 'Partida a frio (s)'
          },
          buttons: {
            start: 'Iniciar',
            stop: 'Parar',
            reset: 'Reiniciar'
          },
          panels: {
            replicas: 'Réplicas de GPU',
            metrics: 'Métricas ao Vivo'
          },
          metrics: {
            replicas: 'Réplicas ativas',
            queue: 'Tamanho da fila',
            latency: 'Latência média',
            cost: 'Custo ($/min)',
            utilization: 'Utilização'
          },
          labels: {
            warming: 'AQUECENDO',
            ready: 'PRONTA',
            idle: 'OCIOSA',
            scale_to_zero: 'Escalado a zero — nenhuma GPU ativa'
          }
        },
        agent_orchestration: {
          title: 'Simulador de Orquestração de Agentes',
          subtitle: 'Laço raciocinar → agir → observar com chamadas de ferramentas',
          controls: {
            max_steps: 'Máx. de passos',
            tool_latency: 'Latência da ferramenta (ms)',
            fail_rate: 'Falha da ferramenta (%)'
          },
          buttons: {
            run: 'Executar Agente',
            reset: 'Reiniciar'
          },
          steps: {
            think: 'Pensar',
            act: 'Chamar Ferramenta',
            observe: 'Observar',
            answer: 'Resposta Final',
            retry: 'Repetir'
          },
          tools: {
            search: 'web_search',
            calculator: 'calculator',
            database: 'db_query'
          },
          metrics: {
            steps: 'Passos executados',
            tool_calls: 'Chamadas de ferramenta',
            retries: 'Tentativas',
            tokens: 'Tokens usados',
            status: 'Status'
          },
          labels: {
            idle: 'Ocioso — execute o agente para começar',
            running: 'Executando',
            done: 'Concluído',
            failed: 'Falhou (máx. de passos atingido)',
            trace: 'Trace de execução'
          }
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
          buttons: {
            settings: 'Configurações',
            start: 'Iniciar Simulação',
            simulating: 'Simulando...'
          },
          settings: {
            title: 'Configurações da Simulação',
            max_retries: 'Máximo de Retries: {{value}}',
            base_delay: 'Delay Base: {{ms}}ms',
            success_rate: 'Taxa de Sucesso: {{percent}}%'
          },
          toggles: {
            use_exponential_backoff: 'Usar Backoff Exponencial',
            add_jitter: 'Adicionar Jitter'
          },
          visualization: {
            title: 'Visualização'
          },
          attempt: {
            label: 'Tentativa {{id}}',
            next_in: 'Próxima tentativa em {{ms}}ms'
          },
          stats: {
            title: 'Estatísticas',
            total_attempts: 'Total de Tentativas',
            final_status: 'Status Final',
            status_success: 'Sucesso',
            status_failure: 'Falha'
          },
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
            none: 'Nenhuma mensagem ainda'
          }
        },
        philosophers_sim: {
          title: 'Jantar dos Filósofos',
          subtitle: 'Cinco filósofos compartilham cinco garfos. Comer exige os dois garfos vizinhos, então os lugares competem pelo mesmo recurso. Escolha uma estratégia e veja como ela evita — ou causa — deadlock.',
          buttons: {
            configure: 'Configurar',
            close_config: 'Fechar Config',
            start: 'Iniciar',
            pause: 'Pausar',
            step: 'Passo',
            reset: 'Resetar'
          },
          config: {
            title: 'Controles',
            strategy: 'Estratégia',
            philosophers: 'Filósofos',
            speed: 'Velocidade'
          },
          strategies: {
            naive: {
              label: 'Ingênua',
              desc: 'Cada filósofo pega o garfo da esquerda e então espera pelo da direita. Se todos pegarem o garfo esquerdo ao mesmo tempo, todos ficam segurando um garfo para sempre — um deadlock clássico.'
            },
            hierarchy: {
              label: 'Hierarquia de Recursos',
              desc: 'Os garfos são numerados; um filósofo sempre pega primeiro o garfo de menor número. Quebrar a condição de espera circular torna o deadlock impossível.'
            },
            atomic: {
              label: 'Dois ou Nenhum',
              desc: 'Um filósofo só pega os garfos quando ambos estão livres, de forma atômica. Ninguém segura um único garfo, então não há deadlock (mas ainda pode haver inanição).'
            },
            arbitrator: {
              label: 'Árbitro Central',
              desc: 'Um garçom permite que no máximo N-1 filósofos tentem pegar garfos ao mesmo tempo. Com um lugar sempre livre, a espera circular nunca se fecha.'
            }
          },
          states: {
            thinking: 'Pensando',
            hungry: 'Com fome',
            eating: 'Comendo'
          },
          viz: {
            title: 'A Mesa',
            tick: 'ciclo',
            eating_now: 'comendo',
            fork_held: 'Garfo em uso',
            deadlock: 'DEADLOCK',
            deadlock_hint: 'Deadlock detectado: cada filósofo com fome segura um garfo e espera para sempre pelo outro. Resete e tente uma estratégia sem deadlock.'
          },
          roster: {
            title: 'Filósofos'
          },
          stats: {
            title: 'Métricas',
            total_meals: 'Refeições totais',
            eating: 'Comendo agora',
            longest_wait: 'Maior espera',
            ticks: 'Ciclos',
            running: 'Executando',
            paused: 'Pausado',
            deadlocked: 'Em deadlock',
            meals_short: '{{n}} refeições'
          },
          log: {
            title: 'Log de Eventos',
            empty: 'Aguardando eventos…',
            got_hungry: '{{name}} ficou com fome',
            took_left: '{{name}} pegou o garfo esquerdo',
            took_right: '{{name}} pegou o garfo direito',
            took_low: '{{name}} pegou o garfo {{fork}}',
            started_eating: '{{name}} pegou os dois garfos e começou a comer',
            finished_eating: '{{name}} terminou de comer e liberou os garfos',
            deadlock_detected: 'Deadlock detectado — nenhum filósofo consegue progredir'
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
          buttons: {
            configure: 'Configurar',
            close_config: 'Fechar Config',
            reset: 'Reiniciar'
          },
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
          messages: {
            processing: 'Processando requisição...'
          },
          history: {
            title: 'Histórico de Requisições:',
            cache_hit: 'Cache Hit'
          },
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
          rules: {
            title: 'Regras do Firewall',
            restore_title: 'Restaurar configuração inicial',
            add_rule: 'Adicionar Regra',
            remove_rule_title: 'Remover regra'
          },
          stats: {
            title: 'Estatísticas',
            total: 'Total de Pacotes',
            allowed: 'Permitidos',
            blocked: 'Bloqueados'
          },
          traffic: {
            title: 'Tráfego de Rede',
            custom_packet: 'Pacote Personalizado',
            generate_packet: 'Gerar Pacote',
            stop_autogen: 'Parar',
            start_autogen: 'Auto Gerar'
          },
          labels: {
            port: 'Porta',
            protocol: 'Protocolo',
            type: 'Tipo',
            payload: 'Payload',
            action_allow: 'Permitir',
            action_block: 'Bloquear'
          },
          badges: {
            allow: 'PERMITIDO',
            block: 'BLOQUEADO'
          },
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
          buttons: {
            downgrade: 'Downgrade',
            upgrade: 'Upgrade',
            start: 'Iniciar Simulação',
            stop: 'Stop Simulation'
          },
          resources: {
            cpu: 'CPU ({{cores}} núcleos)',
            memory: 'Memória ({{gb}} GB)',
            storage: 'Armazenamento ({{gb}} GB)'
          },
          queue_title: 'Fila de Requisições',
          controls_title: 'Controles',
          request_rate: 'Taxa de Requisições ({{rate}}/s)',
          stats_title: 'Estatísticas',
          processed: 'Processadas',
          rejected: 'Rejeitadas',
          success_rate: 'Taxa de Sucesso',
          uptime: 'Tempo Ativo',
          total_cost: 'Custo Total',
          current_load: 'Carga Atual',
          statuses: {
            healthy: 'saudável',
            degraded: 'degradado',
            failed: 'falho',
            role: 'Papel',
            data: 'Dados',
            keys: 'chaves',
            replicated_after: 'Replicado após {{seconds}}s'
          },
          upgrade_modal: {
            title: 'Aumentar Servidor',
            text: 'Deseja aumentar para {{tier}}? Isso aumentará seus custos para R${{cost}}/mês.',
            cancel: 'Cancelar',
            confirm: 'Aumentar'
          }
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
          strong: 'Forte',
          eventual: 'Eventual',
          network_latency_ms: 'Latência de Rede (ms)',
          failure_rate: 'Taxa de Falha',
          auto_failover: 'Auto Failover',
          manual_title: 'Operação Manual',
          read: 'Leitura',
          write: 'Escrita',
          key_placeholder: 'Chave',
          value_placeholder: 'Valor',
          execute: 'Executar',
          start: 'Iniciar Simulação',
          stop: 'Parar Simulação',
          role: 'Papel',
          latency: 'Latência',
          data: 'Dados',
          keys_label: '{{count}} chaves',
          replicated_after: 'Replicado após {{seconds}}s',
          simulate_failure: 'Simular Falha',
          recover: 'Recuperar',
          recent_requests: 'Requisições Recentes',
          read_label: 'Leitura',
          write_label: 'Escrita'
        },
        timeout: {
          title: 'Simulador de Timeout',
          buttons: {
            settings: 'Configurações',
            start: 'Iniciar',
            stop: 'Parar',
            reset: 'Reiniciar'
          },
          settings: {
            title: 'Configurações da Simulação',
            timeout: 'Timeout: {{seconds}}s',
            rps: 'Requisições por Segundo: {{value}}',
            min_response: 'Tempo Mínimo de Resposta: {{seconds}}s',
            max_response: 'Tempo Máximo de Resposta: {{seconds}}s',
            success_rate: 'Taxa de Sucesso: {{percent}}%'
          },
          visualization: {
            title: 'Visualização'
          },
          request_label: 'Requisição {{id}}',
          statuses: {
            success: 'Requisição completada com sucesso',
            timeout: 'Timeout: Requisição excedeu {{seconds}}s',
            error: 'Erro do servidor'
          },
          stats: {
            title: 'Estatísticas',
            total: 'Total de Requisições',
            timeouts: 'Timeouts'
          },
          info: {
            title: 'Explicação',
            p1: 'Este simulador demonstra como o mecanismo de timeout funciona em sistemas distribuídos. Cada requisição tem um tempo limite configurável para ser completada.',
            p2: 'Se a resposta não chegar dentro do tempo limite, a requisição é cancelada e um erro de timeout é retornado, evitando que recursos fiquem presos indefinidamente.',
            p3: 'Ajuste timeout, tempos de resposta e taxa de sucesso para visualizar impactos.'
          }
        },
        event_sourcing: {
          title: 'Simulador de Event Sourcing',
          buttons: {
            settings: 'Configurações',
            reset: 'Reiniciar',
            replay: 'Replay'
          },
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
            speed_opts: {
              half: '0.5s',
              one: '1s',
              two: '2s'
            }
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
        }
      },
      design_principles: {
        availability: {
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
        consistency_strategies: {
          consensus_simulator: {
            controls: {
              protocol_label: 'Protocolo:',
              options: {
                raft: 'Raft',
                paxos: 'Paxos',
                zookeeper: 'ZooKeeper'
              },
              start: 'Iniciar',
              pause: 'Pausar',
              restart: 'Reiniciar',
              speed_label: 'Velocidade:',
              speed_opts: {
                slow: 'Lento',
                normal: 'Normal',
                fast: 'Rápido'
              },
              show_explanations: 'Mostrar Explicações',
              hide_explanations: 'Ocultar Explicações'
            },
            step_prefix: 'Passo',
            cluster_vis_title: 'Visualização do Cluster',
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
          lamport_timestamps_simulator: {
            title: 'Simulador de Timestamps de Lamport',
            subtitle: 'Visualize como os timestamps lógicos são atualizados em um sistema distribuído',
            info: 'Adicione eventos locais ou envie mensagens entre processos para ver como os timestamps de Lamport são atualizados. Observe como a ordem dos eventos é mantida através dos relógios lógicos.',
            controls: {
              reset: 'Reiniciar Simulação'
            },
            process_label: 'Processo {{n}}',
            buttons: {
              local_event: 'Evento Local',
              send_to: '→ {{target}}'
            },
            timeline: {
              clock_prefix: 't = '
            },
            event_labels: {
              local: 'Evento Local',
              send_prefix: '→ {{target}}',
              receive_prefix: '← {{source}}'
            },
            legend: {
              title: 'Legenda',
              local: 'Evento Local',
              sent: 'Mensagem Enviada',
              received: 'Mensagem Recebida'
            }
          }
        },
        two_phase_commit_simulator: {
          title: 'Simulador de Two Phase Commit',
          intro: 'Este simulador demonstra o protocolo Two Phase Commit em uma transferência bancária distribuída. Configure as respostas dos bancos clicando neles antes de iniciar a simulação.',
          controls: {
            start: 'Iniciar',
            pause: 'Pausar',
            simulation: 'Simulação',
            reset: 'Reiniciar',
            speed_label: 'Velocidade:',
            speed_opts: {
              slow: 'Lenta',
              normal: 'Normal',
              fast: 'Rápida'
            }
          },
          nodes: {
            coordinator: 'Coordenador',
            bank_n: 'Banco {{n}}'
          },
          node_states: {
            idle: 'ocioso',
            preparing: 'preparando',
            prepared: 'preparado',
            committed: 'confirmado',
            aborted: 'abortado'
          },
          responses: {
            yes: 'sim',
            no: 'não'
          },
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
            s1: 'Fase 1: Coordenador enviou \'prepare\' para todos os participantes',
            s2: 'Fase 1: Participantes responderam com seus votos',
            s3: 'Fase 2: Coordenador tomou a decisão final',
            s4: 'Simulação concluída! Você pode reiniciar para ver novamente.'
          }
        },
        algorithms: {
          title: 'Algoritmos de Sincronização',
          intro: 'Existem vários algoritmos para garantir a sincronização em sistemas distribuídos. Cada um tem suas características específicas e casos de uso ideais.',
          key_concept_label: 'Conceito Chave',
          key_concept_text: 'A escolha do algoritmo de sincronização depende de fatores como o número de nós, a latência da rede, a tolerância a falhas e os requisitos de performance.',
          bakery: {
            title: 'Algoritmo do Padeiro',
            concept_title: 'Conceito',
            concept_p: 'Baseado na ideia de uma padaria, onde cada cliente recebe um número de senha e é atendido em ordem crescente.',
            badges: {
              total_order: 'Ordem Total',
              fairness: 'Justo'
            },
            demo_title: 'Demo Interativa',
            labels: {
              process: 'Processo',
              ticket: 'Senha',
              request_access: 'Solicitar Acesso'
            }
          },
          token_ring: {
            title: 'Token Ring',
            concept_title: 'Conceito',
            concept_p: 'Um token circula entre os processos em um anel lógico, e apenas o processo que possui o token pode acessar recursos compartilhados.',
            badges: {
              single_token: 'Token Único',
              circular_passing: 'Passagem Circular'
            },
            demo_title: 'Demo Interativa',
            move_token: 'Mover Token',
            labels: {
              process_prefix: 'P'
            }
          },
          ricart_agrawala: {
            title: 'Ricart-Agrawala',
            concept_title: 'Conceito',
            concept_p: 'Baseado em timestamps lógicos, onde processos solicitam permissão de todos os outros processos antes de acessar recursos compartilhados.',
            badges: {
              timestamps: 'Timestamps',
              consensus: 'Consenso'
            },
            demo_title: 'Demo Interativa',
            labels: {
              process: 'Processo',
              request_access: 'Solicitar Acesso',
              ts_prefix: 'TS'
            }
          },
          comparison: {
            title: 'Comparação',
            bakery_title: 'Algoritmo do Padeiro',
            token_ring_title: 'Token Ring',
            ricart_title: 'Ricart-Agrawala',
            advantages: 'Vantagens',
            disadvantages: 'Desvantagens',
            bakery: {
              pros: 'Simples e justo',
              cons: 'Alta complexidade de mensagens'
            },
            token_ring: {
              pros: 'Baixa complexidade de mensagens',
              cons: 'Ponto único de falha'
            },
            ricart: {
              pros: 'Robusto a falhas',
              cons: 'Alta latência'
            }
          }
        },
        service_oriented: {
          title: 'Design Orientado a Serviços',
          intro: 'Explore as diferentes abordagens de organização de serviços e suas implicações práticas. Cada arquitetura tem seus próprios trade-offs e casos de uso ideais.',
          sections: {
            advantages: 'Vantagens',
            disadvantages: 'Desvantagens',
            example_title: 'Exemplo Prático',
            diagram_title: 'Visualização da Arquitetura',
            legend: {
              direct_call: 'Chamada direta',
              interface: 'Interface',
              api_events: 'API/Eventos'
            },
            module_labels: {
              deploy: 'Deploy',
              communication: 'Comunicação',
              database: 'Banco'
            }
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
                auth: {
                  name: 'Autenticação',
                  details: {
                    deployment: 'Deploy único para toda a aplicação',
                    communication: 'Chamadas de função diretas',
                    database: 'Banco de dados compartilhado'
                  }
                },
                orders: {
                  name: 'Pedidos',
                  details: {
                    deployment: 'Deploy único para toda a aplicação',
                    communication: 'Chamadas de função diretas',
                    database: 'Banco de dados compartilhado'
                  }
                },
                users: {
                  name: 'Usuários',
                  details: {
                    deployment: 'Deploy único para toda a aplicação',
                    communication: 'Chamadas de função diretas',
                    database: 'Banco de dados compartilhado'
                  }
                }
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
                auth: {
                  name: 'Módulo de Autenticação',
                  details: {
                    deployment: 'Deploy único, mas módulos independentes',
                    communication: 'Interfaces bem definidas',
                    database: 'Schema separado no banco compartilhado'
                  }
                },
                orders: {
                  name: 'Módulo de Pedidos',
                  details: {
                    deployment: 'Deploy único, mas módulos independentes',
                    communication: 'Interfaces bem definidas',
                    database: 'Schema separado no banco compartilhado'
                  }
                },
                users: {
                  name: 'Módulo de Usuários',
                  details: {
                    deployment: 'Deploy único, mas módulos independentes',
                    communication: 'Interfaces bem definidas',
                    database: 'Schema separado no banco compartilhado'
                  }
                }
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
                auth: {
                  name: 'Auth Service',
                  details: {
                    deployment: 'Deploy independente',
                    communication: 'API REST/gRPC',
                    database: 'Banco de dados próprio'
                  }
                },
                orders: {
                  name: 'Orders Service',
                  details: {
                    deployment: 'Deploy independente',
                    communication: 'API REST/gRPC',
                    database: 'Banco de dados próprio'
                  }
                },
                users: {
                  name: 'Users Service',
                  details: {
                    deployment: 'Deploy independente',
                    communication: 'API REST/gRPC',
                    database: 'Banco de dados próprio'
                  }
                }
              }
            }
          }
        }
      },
      monitoring_maintenance: {
        logs: {
          title: 'Logs e Tracing em Sistemas Distribuídos',
          intro_p1: 'Logs e tracing são fundamentais para entender o comportamento, debugar problemas e manter a observabilidade em sistemas distribuídos. Eles fornecem insights detalhados sobre o fluxo de execução e o estado do sistema.',
          key_concept_label: 'Conceito Chave',
          key_concept_text: 'Em sistemas distribuídos, logs devem ser tratados como streams de eventos, centralizados e correlacionados para fornecer uma visão completa do sistema.',
          types_title: 'Tipos de Logs',
          app_logs_title: 'Logs de Aplicação',
          app_logs_items: [
            'Eventos de negócio',
            'Fluxo de execução',
            'Erros e exceções',
            'Ações do usuário'
          ],
          sys_logs_title: 'Logs de Sistema',
          sys_logs_items: [
            'Inicialização/shutdown',
            'Uso de recursos',
            'Eventos de sistema',
            'Problemas de hardware'
          ],
          sec_logs_title: 'Logs de Segurança',
          sec_logs_items: [
            'Tentativas de acesso',
            'Alterações de permissão',
            'Eventos de auditoria',
            'Alertas de segurança'
          ],
          structured_title: 'Logging Estruturado',
          structured_desc: 'Logging estruturado trata logs como objetos de dados em vez de texto simples, facilitando a análise e a busca.',
          benefits_title: 'Benefícios',
          benefits_items: [
            {
              title: 'Pesquisabilidade',
              desc: 'Facilita buscas e filtros complexos'
            },
            {
              title: 'Análise',
              desc: 'Permite agregações e visualizações'
            },
            {
              title: 'Padronização',
              desc: 'Formato consistente entre serviços'
            }
          ],
          example_title: 'Exemplo',
          aggregation_title: 'Agregação de Logs',
          components_title: 'Componentes',
          components_items: [
            {
              title: 'Coletores',
              desc: 'Agentes que coletam logs de diferentes fontes'
            },
            {
              title: 'Processadores',
              desc: 'Filtram, transformam e enriquecem logs'
            },
            {
              title: 'Armazenamento',
              desc: 'Sistema distribuído para persistência'
            },
            {
              title: 'Interface',
              desc: 'UI para busca e análise'
            }
          ],
          elk_title: 'Stack ELK',
          elk_items: [
            {
              title: 'Elasticsearch',
              desc: 'Armazenamento e busca distribuída de logs'
            },
            {
              title: 'Logstash',
              desc: 'Pipeline de processamento de logs'
            },
            {
              title: 'Kibana',
              desc: 'Visualização e análise de logs'
            }
          ],
          tracing_title: 'Tracing Distribuído',
          tracing_desc: 'Tracing distribuído permite rastrear o fluxo de uma requisição por múltiplos serviços, fornecendo visibilidade end-to-end.',
          concepts_title: 'Conceitos',
          concepts_items: [
            {
              title: 'Trace',
              desc: 'Representa uma transação end-to-end'
            },
            {
              title: 'Span',
              desc: 'Unidade de trabalho dentro de um trace'
            },
            {
              title: 'Context',
              desc: 'Metadados que acompanham o trace'
            }
          ],
          tools_title: 'Ferramentas',
          tools_items: [
            {
              title: 'Jaeger',
              desc: 'Sistema de tracing distribuído de código aberto'
            },
            {
              title: 'Zipkin',
              desc: 'Focado em latência e análise de dependências'
            },
            {
              title: 'OpenTelemetry',
              desc: 'Padrão aberto para instrumentação'
            }
          ],
          best_practices_title: 'Melhores Práticas',
          logging_title: 'Logging',
          logging_items: [
            {
              title: 'Níveis Apropriados',
              desc: 'Use níveis adequadamente (ERROR, WARN, INFO, DEBUG)'
            },
            {
              title: 'Contexto',
              desc: 'Inclua informações relevantes para debugging'
            },
            {
              title: 'Sensibilidade',
              desc: 'Evite dados sensíveis nos logs'
            }
          ],
          tracing_bp_title: 'Tracing',
          tracing_bp_items: [
            {
              title: 'Amostragem',
              desc: 'Configure taxas de amostragem adequadas'
            },
            {
              title: 'Instrumentação',
              desc: 'Use bibliotecas padrão de instrumentação'
            },
            {
              title: 'Correlação',
              desc: 'Mantenha correlação entre logs e traces'
            }
          ]
        },
        logs_page: {
          title: 'Logs e Tracing em Sistemas Distribuídos',
          intro_p1: 'Em sistemas distribuídos, logs e tracing são fundamentais para monitoramento, debugging e análise de performance. Esta seção explora as melhores práticas e ferramentas para implementar um sistema robusto de observabilidade.',
          buttons: {
            logs_simulator: 'Simulador de Logs',
            tracing_simulator: 'Simulador de Tracing'
          },
          levels_title: 'Níveis de Log',
          levels: {
            debug_desc: 'Informações detalhadas para debugging',
            info_desc: 'Eventos normais do sistema',
            warn_desc: 'Avisos sobre situações inesperadas',
            error_desc: 'Erros que precisam de atenção'
          },
          formats: {
            text_title: 'Logs em Texto Puro',
            text_adv_title: 'Vantagens',
            text_adv_items: [
              'Fácil de ler para humanos',
              'Menor overhead de processamento',
              'Compatível com ferramentas legadas',
              'Menor tamanho de arquivo'
            ],
            text_disadv_title: 'Desvantagens',
            text_disadv_items: [
              'Difícil de parsear programaticamente',
              'Falta de estrutura clara',
              'Difícil de adicionar metadados',
              'Propenso a erros de formatação'
            ],
            json_title: 'Logs em JSON',
            json_adv_title: 'Vantagens',
            json_adv_items: [
              'Estrutura clara e consistente',
              'Fácil de parsear e processar',
              'Suporte a metadados complexos',
              'Melhor para análise automatizada'
            ],
            json_disadv_title: 'Desvantagens',
            json_disadv_items: [
              'Maior overhead de processamento',
              'Arquivos de log maiores',
              'Menos legível para humanos',
              'Pode ser excessivo para logs simples'
            ]
          },
          tracing_section: {
            title: 'Distributed Tracing',
            what_is_title: 'O que é Tracing?',
            what_is_p: 'Tracing é uma técnica que permite rastrear o fluxo de uma requisição através de múltiplos serviços em um sistema distribuído. Cada requisição recebe um ID único (traceId) que é propagado entre os serviços.',
            components_title: 'Componentes Principais',
            components_items: [
              'TraceId: Identificador único da requisição',
              'SpanId: Identificador de cada operação',
              'ParentSpanId: Relacionamento entre operações',
              'Tags: Metadados adicionais',
              'Timestamps: Duração das operações'
            ],
            benefits_title: 'Benefícios',
            benefits_items: [
              'Visualização do fluxo de requisições',
              'Identificação de gargalos',
              'Debugging em sistemas distribuídos',
              'Análise de performance',
              'Correlação de eventos'
            ]
          },
          best_practices: {
            title: 'Boas Práticas',
            logging_title: 'Logging',
            logging_items: [
              'Use níveis de log apropriados',
              'Inclua contexto relevante',
              'Mantenha formato consistente',
              'Evite logs sensíveis',
              'Use IDs de correlação',
              'Inclua timestamps',
              'Estruture os metadados',
              'Implemente rotação de logs'
            ],
            tracing_title: 'Tracing',
            tracing_items: [
              'Propague traceId entre serviços',
              'Use spans para operações importantes',
              'Adicione tags relevantes',
              'Mantenha spans concisos',
              'Implemente sampling',
              'Configure retenção adequada',
              'Integre com ferramentas de análise',
              'Monitore overhead de tracing'
            ]
          },
          tools: {
            title: 'Ferramentas Populares',
            logging_title: 'Logging',
            logging_items: [
              'ELK Stack (Elasticsearch, Logstash, Kibana)',
              'Graylog',
              'Loki',
              'Datadog',
              'New Relic',
              'Splunk'
            ],
            tracing_title: 'Tracing',
            tracing_items: [
              'Jaeger',
              'Zipkin',
              'OpenTelemetry',
              'Datadog APM',
              'New Relic APM',
              'Lightstep'
            ]
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
        }
      },
      security: {
        title: 'Segurança em Sistemas Distribuídos'
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
          sync: 'Síncrona',
          semi_sync: 'Semi-síncrona',
          async: 'Assíncrona',
          network_latency_ms: 'Latência de Rede (ms)',
          failure_rate: 'Taxa de Falha',
          replica_count: 'Número de Réplicas',
          manual_title: 'Operação Manual',
          key_placeholder: 'Chave',
          value_placeholder: 'Valor',
          write: 'Escrever',
          start: 'Iniciar Simulação',
          stop: 'Parar Simulação',
          statuses: {
            healthy: 'saudável',
            failed: 'falho',
            role: 'Papel',
            latency: 'Latência',
            data: 'Dados',
            keys_label: '{{count}} chaves',
            replicated_after: 'Replicado após {{seconds}}s'
          },
          simulate_failure: 'Simular Falha',
          recover: 'Recuperar',
          recent_ops: 'Requisições Recentes',
          read_label: 'Leitura',
          write_label: 'Escrita'
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