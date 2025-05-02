import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Get stored language from localStorage or default to English
    const initialLanguage = localStorage.getItem('selectedLanguage') || 'en';
    const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);
    
    // All available languages - only English and Vietnamese
    const languages = useMemo(() => [
        { code: 'en', name: 'English' },
        { code: 'vi', name: 'Vietnamese' }
    ], []);

    // Static translations for common UI elements
    const staticTranslations = useMemo(() => ({
        en: {
            'Flashcards': 'Flashcards',
            'Readings': 'Readings',
            'Writing': 'Writing',
            'Discover': 'Discover',
            'Sign In': 'Sign In',
            'Get Started': 'Get Started',
            'Select Language': 'Select Language',
            'Home': 'Home',
            'Your Flashcards': 'Your Flashcards',
            'Explore Flashcards': 'Explore Flashcards',
            'Your Readings': 'Your Readings',
            'Explore Tests': 'Explore Tests',
            'Your Writing': 'Your Writing',
            'Explore Writing': 'Explore Writing',
            'Writing Exercises': 'Writing Exercises',
            'Progress': 'Progress',
            'Logout': 'Logout',
            'Explore': 'Explore',
            'Multiple Choice Tests': 'Multiple Choice Tests',
            'Enter API Key': 'Enter API Key',
            'Learning Language': 'Learning Language',
            'Native Language': 'Native Language',
            'My Flashcards': 'My Flashcards',
            'Create Manual Set': 'Create Manual Set',
            'Create AI Set': 'Create AI Set',
            'Study Without an Account': 'Study Without an Account',
            'All flashcard sets shown here are public and can be studied without signing in, but your learning time, progress and streaks will not be saved.': 'All flashcard sets shown here are public and can be studied without signing in, but your learning time, progress and streaks will not be saved.',
            'Loading...': 'Loading...',
            'Cards': 'Cards',
            'Level': 'Level',
            'Learners': 'Learners',
            'Items Per Page': 'Items Per Page',
            'You haven\'t created any flashcard sets yet.': 'You haven\'t created any flashcard sets yet.',
            'Create New': 'Create New',
            'Edit': 'Edit',
            'Delete': 'Delete',
            'Study': 'Study',
            'Save': 'Save',
            'Cancel': 'Cancel',
            'Confirm': 'Confirm',
            'Search': 'Search',
            'No results found': 'No results found',
            'View': 'View',
            'Back': 'Back',
            'Next': 'Next',
            'Previous': 'Previous',
            'Submit': 'Submit',
            'Settings': 'Settings',
            'Profile': 'Profile',
            'Account': 'Account',
            'Help': 'Help',
            'Contact': 'Contact',
            'About': 'About',
            'Terms': 'Terms',
            'Privacy': 'Privacy',
            'Copyright': 'Copyright',
            'All rights reserved': 'All rights reserved',
            'Master Languages with': 'Master Languages with',
            'Smart Flashcards': 'Smart Flashcards',
            'Transform your language learning journey with AI-powered flashcards, personalized study plans, and interactive exercises. Start learning smarter, not harder.': 'Transform your language learning journey with AI-powered flashcards, personalized study plans, and interactive exercises. Start learning smarter, not harder.',
            'Start Free Trial': 'Start Free Trial',
            'Explore Features': 'Explore Features',
            'Active Users': 'Active Users',
            'Flashcards Created': 'Flashcards Created',
            'Success Rate': 'Success Rate',
            'About WordWise': 'About WordWise',
            'Smart language learning platform designed to help everyone learn effectively': 'Smart language learning platform designed to help everyone learn effectively',
            'Our Mission': 'Our Mission',
            'WordWise was created with a simple but ambitious mission: To make language learning an effective, enjoyable, and accessible experience for everyone. We believe that language is not just a communication tool but also a bridge between cultures, opening opportunities and connecting people.': 'WordWise was created with a simple but ambitious mission: To make language learning an effective, enjoyable, and accessible experience for everyone. We believe that language is not just a communication tool but also a bridge between cultures, opening opportunities and connecting people.',
            'With a team of leading language experts and technologists, we continuously develop modern learning methods based on scientific research on memory and language acquisition.': 'With a team of leading language experts and technologists, we continuously develop modern learning methods based on scientific research on memory and language acquisition.',
            'WordWise Mission': 'WordWise Mission',
            'Benefits of Learning with WordWise': 'Benefits of Learning with WordWise',
            'Smart Learning with AI': 'Smart Learning with AI',
            'Our AI system analyzes your learning style and progress, creating a personalized learning path that helps you progress 3 times faster than traditional methods.': 'Our AI system analyzes your learning style and progress, creating a personalized learning path that helps you progress 3 times faster than traditional methods.',
            'Detailed Progress Tracking': 'Detailed Progress Tracking',
            'Visual analytics charts help you easily track progress in each skill, vocabulary and grammar, while suggesting areas for review.': 'Visual analytics charts help you easily track progress in each skill, vocabulary and grammar, while suggesting areas for review.',
            'Scientific Methods': 'Scientific Methods',
            'Applying spaced repetition and active recall techniques - two methods proven to be most effective for long-term retention and deep understanding.': 'Applying spaced repetition and active recall techniques - two methods proven to be most effective for long-term retention and deep understanding.',
            'Motivation System': 'Motivation System',
            'Smart gamification with badges, leaderboards, and daily challenges helps maintain long-term learning motivation.': 'Smart gamification with badges, leaderboards, and daily challenges helps maintain long-term learning motivation.',
            'Learning Community': 'Learning Community',
            'Connect with a global community of learners, share resources and encourage each other on the journey to conquer a new language.': 'Connect with a global community of learners, share resources and encourage each other on the journey to conquer a new language.',
            'Language Diversity': 'Language Diversity',
            'Support for over 15 of the world\'s most popular languages with content curated by native speakers, ensuring accuracy and practicality.': 'Support for over 15 of the world\'s most popular languages with content curated by native speakers, ensuring accuracy and practicality.',
            'Accessibility': 'Accessibility',
            'At WordWise, we believe that language education should be accessible to everyone, regardless of ability, geographic location, or economic circumstances.': 'At WordWise, we believe that language education should be accessible to everyone, regardless of ability, geographic location, or economic circumstances.',
            'Designed for Everyone': 'Designed for Everyone',
            'Screen reader-friendly interface and keyboard navigation support': 'Screen reader-friendly interface and keyboard navigation support',
            'Subtitles and transcripts for all audio content': 'Subtitles and transcripts for all audio content',
            'Customizable fonts, sizes, and color contrast': 'Customizable fonts, sizes, and color contrast',
            'Works on all devices, from computers to mobile phones': 'Works on all devices, from computers to mobile phones',
            'Offline learning features for areas with limited internet connection': 'Offline learning features for areas with limited internet connection',
            'Financial Accessibility': 'Financial Accessibility',
            'Our freemium model allows all users to access basic features for free. We also offer scholarships and special discounts for students, teachers, and users from developing countries.': 'Our freemium model allows all users to access basic features for free. We also offer scholarships and special discounts for students, teachers, and users from developing countries.',
            'What Our Users Say': 'What Our Users Say',
            '"WordWise helped me master English after years of failure with other methods. The personalized approach and smart reminder system are the keys to helping me maintain daily learning."': '"WordWise helped me master English after years of failure with other methods. The personalized approach and smart reminder system are the keys to helping me maintain daily learning."',
            'Software Engineer, 267 consecutive learning days': 'Software Engineer, 267 consecutive learning days',
            '"As a hearing-impaired language learner, I\'m very impressed with WordWise\'s accessibility features. Visual support and learning methods that don\'t rely entirely on sound help me learn effectively."': '"As a hearing-impaired language learner, I\'m very impressed with WordWise\'s accessibility features. Visual support and learning methods that don\'t rely entirely on sound help me learn effectively."',
            'University Student, Fluent in 2 languages': 'University Student, Fluent in 2 languages',
            'Start Your Language Journey Today': 'Start Your Language Journey Today',
            'Join more than 5 million learners worldwide and discover how WordWise can help you conquer a new language effectively.': 'Join more than 5 million learners worldwide and discover how WordWise can help you conquer a new language effectively.',
            'Register for Free': 'Register for Free',
            'Learn More': 'Learn More'
        },
        vi: {
            'Flashcards': 'Thẻ ghi nhớ',
            'Readings': 'Bài đọc',
            'Writing': 'Viết',
            'Discover': 'Khám phá',
            'Sign In': 'Đăng nhập',
            'Get Started': 'Bắt đầu ngay',
            'Select Language': 'Chọn ngôn ngữ',
            'Home': 'Trang chủ',
            'Your Flashcards': 'Thẻ ghi nhớ của bạn',
            'Explore Flashcards': 'Khám phá thẻ ghi nhớ',
            'Your Readings': 'Bài đọc của bạn',
            'Explore Tests': 'Khám phá bài kiểm tra',
            'Your Writing': 'Bài viết của bạn',
            'Explore Writing': 'Khám phá bài viết',
            'Writing Exercises': 'Bài tập viết',
            'Progress': 'Tiến độ',
            'Logout': 'Đăng xuất',
            'Explore': 'Khám phá',
            'Multiple Choice Tests': 'Bài kiểm tra trắc nghiệm',
            'Enter API Key': 'Nhập khóa API',
            'Learning Language': 'Ngôn ngữ học',
            'Native Language': 'Ngôn ngữ bản địa',
            'My Flashcards': 'Thẻ ghi nhớ của tôi',
            'Create Manual Set': 'Tạo bộ thẻ thủ công',
            'Create AI Set': 'Tạo bộ thẻ bằng AI',
            'Study Without an Account': 'Học mà không cần tài khoản',
            'All flashcard sets shown here are public and can be studied without signing in, but your learning time, progress and streaks will not be saved.': 'Tất cả các bộ thẻ ghi nhớ hiển thị ở đây là công khai và có thể được học mà không cần đăng nhập, nhưng thời gian học, tiến độ và chuỗi ngày học của bạn sẽ không được lưu lại.',
            'Loading...': 'Đang tải...',
            'Cards': 'Thẻ',
            'Level': 'Cấp độ',
            'Learners': 'Người học',
            'Items Per Page': 'Số mục trên mỗi trang',
            'You haven\'t created any flashcard sets yet.': 'Bạn chưa tạo bộ thẻ ghi nhớ nào.',
            'Create New': 'Tạo mới',
            'Edit': 'Chỉnh sửa',
            'Delete': 'Xóa',
            'Study': 'Học',
            'Save': 'Lưu',
            'Cancel': 'Hủy',
            'Confirm': 'Xác nhận',
            'Search': 'Tìm kiếm',
            'No results found': 'Không tìm thấy kết quả',
            'View': 'Xem',
            'Back': 'Quay lại',
            'Next': 'Tiếp theo',
            'Previous': 'Trước đó',
            'Submit': 'Gửi',
            'Settings': 'Cài đặt',
            'Profile': 'Hồ sơ',
            'Account': 'Tài khoản',
            'Help': 'Trợ giúp',
            'Contact': 'Liên hệ',
            'About': 'Giới thiệu',
            'Terms': 'Điều khoản',
            'Privacy': 'Quyền riêng tư',
            'Copyright': 'Bản quyền',
            'All rights reserved': 'Tất cả các quyền được bảo lưu',
            'Master Languages with': 'Làm Chủ Ngôn Ngữ với',
            'Smart Flashcards': 'Thẻ Ghi Nhớ Thông Minh',
            'Transform your language learning journey with AI-powered flashcards, personalized study plans, and interactive exercises. Start learning smarter, not harder.': 'Biến đổi hành trình học ngôn ngữ của bạn với thẻ ghi nhớ được hỗ trợ bởi AI, kế hoạch học tập cá nhân hóa và bài tập tương tác. Bắt đầu học thông minh hơn, không phải khó khăn hơn.',
            'Start Free Trial': 'Dùng Thử Miễn Phí',
            'Explore Features': 'Khám Phá Tính Năng',
            'Active Users': 'Người Dùng Đang Hoạt Động',
            'Flashcards Created': 'Thẻ Ghi Nhớ Đã Tạo',
            'Success Rate': 'Tỷ Lệ Thành Công',
            'About WordWise': 'Giới thiệu về WordWise',
            'Smart language learning platform designed to help everyone learn effectively': 'Nền tảng học ngôn ngữ thông minh được thiết kế để giúp mọi người học hiệu quả',
            'Our Mission': 'Sứ mệnh của chúng tôi',
            'WordWise was created with a simple but ambitious mission: To make language learning an effective, enjoyable, and accessible experience for everyone. We believe that language is not just a communication tool but also a bridge between cultures, opening opportunities and connecting people.': 'WordWise được tạo ra với sứ mệnh đơn giản nhưng đầy tham vọng: Biến việc học ngôn ngữ trở thành trải nghiệm hiệu quả, thú vị và dễ tiếp cận cho tất cả mọi người. Chúng tôi tin rằng ngôn ngữ không chỉ là công cụ giao tiếp mà còn là cầu nối giữa các nền văn hóa, mở ra cơ hội và kết nối mọi người.',
            'With a team of leading language experts and technologists, we continuously develop modern learning methods based on scientific research on memory and language acquisition.': 'Với đội ngũ các chuyên gia ngôn ngữ và công nghệ hàng đầu, chúng tôi liên tục phát triển các phương pháp học tập hiện đại dựa trên nghiên cứu khoa học về trí nhớ và việc tiếp thu ngôn ngữ.',
            'WordWise Mission': 'Sứ mệnh WordWise',
            'Benefits of Learning with WordWise': 'Lợi ích khi học với WordWise',
            'Smart Learning with AI': 'Học thông minh với AI',
            'Our AI system analyzes your learning style and progress, creating a personalized learning path that helps you progress 3 times faster than traditional methods.': 'Hệ thống AI của chúng tôi phân tích phong cách học tập và tiến độ của bạn, tạo ra lộ trình học tập cá nhân hóa giúp bạn tiến bộ nhanh gấp 3 lần so với các phương pháp truyền thống.',
            'Detailed Progress Tracking': 'Theo dõi tiến độ chi tiết',
            'Visual analytics charts help you easily track progress in each skill, vocabulary and grammar, while suggesting areas for review.': 'Biểu đồ phân tích trực quan giúp bạn dễ dàng theo dõi tiến độ trong từng kỹ năng, từ vựng và ngữ pháp, đồng thời đề xuất các lĩnh vực cần ôn tập.',
            'Scientific Methods': 'Phương pháp khoa học',
            'Applying spaced repetition and active recall techniques - two methods proven to be most effective for long-term retention and deep understanding.': 'Áp dụng kỹ thuật lặp lại ngắt quãng và gợi nhớ chủ động - hai phương pháp đã được chứng minh là hiệu quả nhất cho việc ghi nhớ lâu dài và hiểu sâu.',
            'Motivation System': 'Hệ thống tạo động lực',
            'Smart gamification with badges, leaderboards, and daily challenges helps maintain long-term learning motivation.': 'Gamification thông minh với huy hiệu, bảng xếp hạng và thử thách hàng ngày giúp duy trì động lực học tập lâu dài.',
            'Learning Community': 'Cộng đồng học tập',
            'Connect with a global community of learners, share resources and encourage each other on the journey to conquer a new language.': 'Kết nối với cộng đồng người học toàn cầu, chia sẻ tài nguyên và khuyến khích nhau trên hành trình chinh phục ngôn ngữ mới.',
            'Language Diversity': 'Đa dạng ngôn ngữ',
            'Support for over 15 of the world\'s most popular languages with content curated by native speakers, ensuring accuracy and practicality.': 'Hỗ trợ hơn 15 ngôn ngữ phổ biến nhất thế giới với nội dung được tuyển chọn bởi người bản xứ, đảm bảo tính chính xác và thực tiễn.',
            'Accessibility': 'Khả năng tiếp cận',
            'At WordWise, we believe that language education should be accessible to everyone, regardless of ability, geographic location, or economic circumstances.': 'Tại WordWise, chúng tôi tin rằng giáo dục ngôn ngữ nên được tiếp cận bởi tất cả mọi người, bất kể khả năng, vị trí địa lý hay hoàn cảnh kinh tế.',
            'Designed for Everyone': 'Thiết kế cho mọi người',
            'Screen reader-friendly interface and keyboard navigation support': 'Giao diện thân thiện với trình đọc màn hình và hỗ trợ điều hướng bàn phím',
            'Subtitles and transcripts for all audio content': 'Phụ đề và bản ghi cho tất cả nội dung âm thanh',
            'Customizable fonts, sizes, and color contrast': 'Tùy chỉnh phông chữ, kích thước và độ tương phản màu sắc',
            'Works on all devices, from computers to mobile phones': 'Hoạt động trên tất cả các thiết bị, từ máy tính đến điện thoại di động',
            'Offline learning features for areas with limited internet connection': 'Tính năng học ngoại tuyến cho các khu vực có kết nối internet hạn chế',
            'Financial Accessibility': 'Khả năng tiếp cận về tài chính',
            'Our freemium model allows all users to access basic features for free. We also offer scholarships and special discounts for students, teachers, and users from developing countries.': 'Mô hình freemium của chúng tôi cho phép tất cả người dùng truy cập các tính năng cơ bản miễn phí. Chúng tôi cũng cung cấp học bổng và giảm giá đặc biệt cho học sinh, giáo viên và người dùng từ các quốc gia đang phát triển.',
            'What Our Users Say': 'Người dùng nói gì về chúng tôi',
            '"WordWise helped me master English after years of failure with other methods. The personalized approach and smart reminder system are the keys to helping me maintain daily learning."': '"WordWise đã giúp tôi thành thạo tiếng Anh sau nhiều năm thất bại với các phương pháp khác. Cách tiếp cận cá nhân hóa và hệ thống nhắc nhở thông minh là chìa khóa giúp tôi duy trì việc học hàng ngày."',
            'Software Engineer, 267 consecutive learning days': 'Kỹ sư phần mềm, 267 ngày học liên tiếp',
            '"As a hearing-impaired language learner, I\'m very impressed with WordWise\'s accessibility features. Visual support and learning methods that don\'t rely entirely on sound help me learn effectively."': '"Là người học ngôn ngữ khiếm thính, tôi rất ấn tượng với các tính năng tiếp cận của WordWise. Hỗ trợ trực quan và phương pháp học tập không hoàn toàn dựa vào âm thanh giúp tôi học hiệu quả."',
            'University Student, Fluent in 2 languages': 'Sinh viên đại học, thông thạo 2 ngôn ngữ',
            'Start Your Language Journey Today': 'Bắt đầu hành trình ngôn ngữ của bạn ngay hôm nay',
            'Join more than 5 million learners worldwide and discover how WordWise can help you conquer a new language effectively.': 'Tham gia cùng hơn 5 triệu người học trên toàn thế giới và khám phá cách WordWise có thể giúp bạn chinh phục ngôn ngữ mới một cách hiệu quả.',
            'Register for Free': 'Đăng ký miễn phí',
            'Learn More': 'Tìm hiểu thêm'
        }
    }), []);

    // Simple translation function - returns static translation if available
    const translateText = useCallback((text) => {
        if (!text) return '';
        
        // If not English and we have a translation, use it
        if (currentLanguage !== 'en' && 
            staticTranslations[currentLanguage] && 
            staticTranslations[currentLanguage][text]) {
            return staticTranslations[currentLanguage][text];
        }
        
        // Otherwise return original text
        return text;
    }, [currentLanguage, staticTranslations]);

    // Change language and save to localStorage
    const changeLanguage = useCallback((langCode) => {
        if (langCode && languages.some(lang => lang.code === langCode)) {
            setCurrentLanguage(langCode);
            localStorage.setItem('selectedLanguage', langCode);
        }
    }, [languages]);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        currentLanguage,
        languages,
        translateText,
        changeLanguage
    }), [currentLanguage, languages, translateText, changeLanguage]);

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageContext; 