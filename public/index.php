<?php
/**
 * Vidi Veda - Dynamic SEO Meta-Tag Injector
 */

// Production site origin (used for canonical, og:url, images, structured data)
$SITE_ORIGIN = "https://vidiveda.in";

// 1. Get the current request path (clean URL routing)
$request_uri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($request_uri, PHP_URL_PATH);
$path = rtrim($path, '/');

// If root path is empty, default to '/'
if (empty($path)) {
    $path = '/';
}

// 2. Define default Fallback SEO Meta Tags
$title = "Vidi Veda | Trusted Home Tutors for CBSE & ICSE Across India";
$description = "Find verified personal home tutors and online tuition classes for CBSE & ICSE school students. One-to-one attention, experienced teachers, and better grades.";
$keywords = "home tutor, online tuition, CBSE home tutor, ICSE home tutor, Vidi Veda, personal tuition Bareilly, home tuition Meerut";

// 3. Load dynamic SEO configs from JSON database
$seo_json_file = __DIR__ . '/seoData.json';
if (file_exists($seo_json_file)) {
    $seo_data = json_decode(file_get_contents($seo_json_file), true);

    // Check if the current route has custom SEO tags
    if (is_array($seo_data) && isset($seo_data[$path])) {
        $title = $seo_data[$path]['title'] ?? $title;
        $description = $seo_data[$path]['description'] ?? $description;
        $keywords = $seo_data[$path]['keywords'] ?? $keywords;
    }
}

// 4. Derived SEO values
$canonical_url = $SITE_ORIGIN . ($path === '/' ? '/' : $path);
$og_image = $SITE_ORIGIN . "/images/hero.png";

// 5. Structured data (JSON-LD)
//    - EducationalOrganization on every page
//    - FAQPage additionally on the FAQ route
$org_schema = [
    "@context" => "https://schema.org",
    "@type" => "EducationalOrganization",
    "name" => "Vidi Veda",
    "url" => $SITE_ORIGIN . "/",
    "logo" => $SITE_ORIGIN . "/favicon.svg",
    "description" => "Verified home tutors and online tuition for CBSE, ICSE and State Board students across India.",
    "email" => "support.vidiveda@gmail.com",
    "telephone" => ["+91-63988-89697", "+91-96343-47076"],
    "areaServed" => "IN",
    "address" => [
        "@type" => "PostalAddress",
        "addressLocality" => "Bareilly",
        "addressRegion" => "Uttar Pradesh",
        "postalCode" => "243001",
        "addressCountry" => "IN",
    ],
    "openingHours" => "Mo-Sa 09:00-20:00",
    "sameAs" => [],
];

$schema_blocks = [$org_schema];

if ($path === "/frequently-asked-questions") {
    $faqs = [
        ["How do I find the right tutor for my child?", "Simply share your requirements with us, including your child's class, subjects, board, preferred timings, and learning goals. Our team carefully matches your child with a suitable tutor based on these requirements."],
        ["Can I book a demo class before starting regular tuition?", "Yes. We offer a demo session so that parents and students can interact with the tutor, understand the teaching style, and decide if it is the right fit before starting regular classes."],
        ["How are tutors verified?", "Every tutor goes through a verification process that may include identity verification, qualification checks, teaching experience review, interviews, and subject knowledge evaluation."],
        ["What if I am not satisfied with the tutor?", "Your satisfaction is important to us. If the tutor is not the right fit for your child, our team will work with you to find a suitable replacement whenever possible."],
        ["Do you provide home tuition or online classes?", "We provide both home tuition and online learning support. Parents can choose the option that best suits their child's learning needs and schedule."],
        ["Which classes do you cover?", "We provide tutoring support from Play Group and Primary Classes to Class 12, including academic guidance for school studies, board exams, and foundation learning programs."],
        ["Which boards do you support?", "Our tutors support students from CBSE, ICSE, ISC, State Boards, International School Curriculums, E-Techno Schools, and other recognized educational boards."],
        ["Which subjects do you teach?", "We provide support for Mathematics, Science, Physics, Chemistry, Biology, English, Hindi, Social Science, Computer Science, Commerce subjects, Humanities subjects, Coding, Artificial Intelligence, and many more."],
        ["How much does home tuition cost?", "Tuition fees vary depending on the student's class, subjects, location, tutor experience, and learning requirements. Our team shares complete fee details after understanding your needs."],
        ["Can one tutor teach multiple subjects?", "Yes. Depending on the tutor's qualifications and expertise, many tutors can teach multiple subjects, especially for primary and middle school students."],
        ["Do you provide tuition for board exam preparation?", "Yes. We provide focused support for board exam preparation, revision planning, sample paper practice, doubt solving, and subject-specific guidance."],
        ["Can I choose my preferred class timings?", "Yes. We try to match students with tutors based on their preferred schedule and availability for a convenient learning experience."],
        ["How do parents track student progress?", "Regular feedback, performance discussions, and progress updates help parents stay informed about their child's learning journey and academic improvement."],
        ["Do you provide tutors for competitive foundation programs?", "Yes. We also support students preparing for Olympiads, NTSE, scholarship exams, JEE Foundation, NEET Foundation, and other academic enrichment programs."],
        ["How quickly can a tutor be assigned?", "The time required depends on the student's requirements and location. In many cases, we can begin the tutor matching process shortly after receiving the inquiry."],
    ];

    $faq_items = [];
    foreach ($faqs as $faq) {
        $faq_items[] = [
            "@type" => "Question",
            "name" => $faq[0],
            "acceptedAnswer" => [
                "@type" => "Answer",
                "text" => $faq[1],
            ],
        ];
    }

    $schema_blocks[] = [
        "@context" => "https://schema.org",
        "@type" => "FAQPage",
        "mainEntity" => $faq_items,
    ];
}

$structured_data = "";
foreach ($schema_blocks as $block) {
    $json = json_encode($block, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $structured_data .= '<script type="application/ld+json">' . $json . '</script>' . "\n    ";
}

// 6. Fetch the compiled index.html generated by Vite build
$html_file = __DIR__ . '/index.html';

if (file_exists($html_file)) {
    $html = file_get_contents($html_file);

    // Inject dynamic tags into index.html
    $html = str_replace('{{META_TITLE}}', htmlspecialchars($title), $html);
    $html = str_replace('{{META_DESCRIPTION}}', htmlspecialchars($description), $html);
    $html = str_replace('{{META_KEYWORDS}}', htmlspecialchars($keywords), $html);
    $html = str_replace('{{CANONICAL_URL}}', htmlspecialchars($canonical_url), $html);
    $html = str_replace('{{OG_IMAGE}}', htmlspecialchars($og_image), $html);
    $html = str_replace('{{STRUCTURED_DATA}}', $structured_data, $html);

    echo $html;
} else {
    // If the site hasn't been built yet or index.html is missing
    header('Content-Type: text/html; charset=utf-8');
    echo "<!DOCTYPE html><html><head><title>Vidi Veda loading...</title></head><body style='font-family:sans-serif;text-align:center;padding:50px;'><h1>Vidi Veda Website is Loading...</h1><p>If you are the developer, run <code>npm run build</code> first to generate the production index.html file.</p></body></html>";
}
?>
