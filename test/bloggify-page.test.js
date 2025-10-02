const BloggifyPage = require('../lib/index.js');

describe('BloggifyPage', () => {
    describe('Constructor', () => {
        test('should create a basic page with title and content', () => {
            const page = new BloggifyPage({
                title: "Test Page",
                content: "This is test content"
            });

            expect(page.title).toBe("Test Page");
            expect(page.content).toBe("This is test content");
            expect(page.raw_content).toBe("This is test content");
            expect(page.slug).toBe("test-page");
            expect(page.url).toBe("/test-page");
        });

        test('should create a page with only title', () => {
            const page = new BloggifyPage({
                title: "Simple Page"
            });

            expect(page.title).toBe("Simple Page");
            expect(page.slug).toBe("simple-page");
            expect(page.url).toBe("/simple-page");
            expect(page.content).toBeUndefined();
        });

        test('should handle empty input object', () => {
            // Note: This test demonstrates current behavior - undefined title causes slugify to crash
            // This could be considered a bug that should be fixed in the library
            expect(() => {
                new BloggifyPage({});
            }).toThrow();
        });
    });

    describe('Slug Generation', () => {
        test('should generate correct slug from title', () => {
            const page = new BloggifyPage({
                title: "My Awesome Blog Post!"
            });

            expect(page.slug).toBe("my-awesome-blog-post");
        });

        test('should handle special characters in title', () => {
            const page = new BloggifyPage({
                title: "Hello, World! @#$%^&*()"
            });

            expect(page.slug).toBe("hello-world-and");
        });

        test('should use custom slug if provided', () => {
            const page = new BloggifyPage({
                title: "Test Page",
                slug: "custom-slug"
            });

            expect(page.slug).toBe("custom-slug");
        });
    });

    describe('URL Generation', () => {
        test('should generate URL from slug', () => {
            const page = new BloggifyPage({
                title: "Test Page"
            });

            expect(page.url).toBe("/test-page");
        });

        test('should use custom URL if provided', () => {
            const page = new BloggifyPage({
                title: "Test Page",
                url: "/custom-url"
            });

            expect(page.url).toBe("/custom-url");
        });

    });

    describe('Content Handling', () => {
        test('should handle HTML content', () => {
            const page = new BloggifyPage({
                title: "HTML Page",
                html: "<h1>Hello World</h1><p>This is HTML content</p>"
            });

            expect(page.content).toBe("<h1>Hello World</h1><p>This is HTML content</p>");
            expect(page.title).toBe("HTML Page");
        });

        test('should handle Markdown content', () => {
            const page = new BloggifyPage({
                title: "Markdown Page",
                markdown: "# Hello World\nThis is **bold** text"
            });

            expect(page.raw_content).toBe("# Hello World\nThis is **bold** text");
        });

        test('should prioritize html over content', () => {
            const page = new BloggifyPage({
                title: "Multi Content Page",
                content: "Plain content",
                html: "<p>HTML content</p>"
            });

            expect(page.content).toBe("<p>HTML content</p>");
            expect(page.raw_content).toBe("<p>HTML content</p>");
        });

        test('should handle rawContent property', () => {
            const page = new BloggifyPage({
                title: "Raw Content Page",
                rawContent: "This is raw content"
            });

            expect(page.raw_content).toBe("This is raw content");
        });
    });

    describe('Metadata Handling', () => {
        test('should merge metadata properties into page object', () => {
            const page = new BloggifyPage({
                title: "Page with Metadata",
                content: "Some content",
                metadata: {
                    author: "John Doe",
                    publishDate: "2025-10-02",
                    customField: "Custom Value"
                }
            });

            expect(page.author).toBe("John Doe");
            expect(page.publishDate).toBe("2025-10-02");
            expect(page.customField).toBe("Custom Value");
            expect(page.title).toBe("Page with Metadata");
            expect(page.content).toBe("Some content");
        });

        test('should handle metadata with title and slug', () => {
            const page = new BloggifyPage({
                metadata: {
                    title: "Metadata Title",
                    slug: "metadata-slug",
                    url: "/metadata-url"
                }
            });

            expect(page.title).toBe("Metadata Title");
            expect(page.slug).toBe("metadata-slug");
            expect(page.url).toBe("/metadata-url");
        });

        test('should handle complex metadata objects', () => {
            const page = new BloggifyPage({
                title: "Complex Metadata",
                metadata: {
                    tags: ["javascript", "testing", "blogging"],
                    settings: {
                        featured: true,
                        comments: false
                    },
                    author: {
                        name: "Jane Doe",
                        email: "jane@example.com"
                    }
                }
            });

            expect(page.tags).toEqual(["javascript", "testing", "blogging"]);
            expect(page.settings).toEqual({ featured: true, comments: false });
            expect(page.author).toEqual({ name: "Jane Doe", email: "jane@example.com" });
        });

        test('should handle empty metadata', () => {
            const page = new BloggifyPage({
                title: "No Metadata",
                metadata: {}
            });

            expect(page.title).toBe("No Metadata");
            expect(page.metadata).toEqual({});
        });

        test('should prioritize direct properties over metadata', () => {
            const page = new BloggifyPage({
                title: "Direct Title",
                author: "Direct Author",
                metadata: {
                    title: "Metadata Title",
                    author: "Metadata Author",
                    category: "Blog"
                }
            });

            expect(page.title).toBe("Direct Title");
            expect(page.author).toBe("Direct Author");
            expect(page.category).toBe("Blog");
        });

        test('should handle main_image from metadata', () => {
            const page = new BloggifyPage({
                title: "Image Test",
                metadata: {
                    main_image: "https://example.com/image.jpg"
                }
            });

            expect(page.main_image).toBe("https://example.com/image.jpg");
        });
    });

    describe('Edge Cases', () => {
        test('should handle null values', () => {
            const page = new BloggifyPage({
                title: "Test",
                content: null,
                metadata: {
                    author: null,
                    tags: null
                }
            });

            expect(page.title).toBe("Test");
            expect(page.content).toBe(null);
            expect(page.author).toBe(null);
            expect(page.tags).toBe(null);
        });

        test('should handle undefined values', () => {
            const page = new BloggifyPage({
                title: "Test",
                content: undefined,
                metadata: {
                    author: undefined
                }
            });

            expect(page.title).toBe("Test");
            expect(page.content).toBe(undefined);
            expect(page.author).toBe(undefined);
        });

        test('should handle numeric values', () => {
            const page = new BloggifyPage({
                title: "Numeric Test",
                metadata: {
                    views: 1000,
                    rating: 4.5,
                    year: 2025
                }
            });

            expect(page.views).toBe(1000);
            expect(page.rating).toBe(4.5);
            expect(page.year).toBe(2025);
        });

        test('should handle boolean values', () => {
            const page = new BloggifyPage({
                title: "Boolean Test",
                metadata: {
                    published: true,
                    featured: false,
                    draft: true
                }
            });

            expect(page.published).toBe(true);
            expect(page.featured).toBe(false);
            expect(page.draft).toBe(true);
        });
    });

    describe('Real-world Examples', () => {
        test('should handle blog post example', () => {
            const page = new BloggifyPage({
                title: "Getting Started with Node.js",
                content: "Node.js is a powerful JavaScript runtime...",
                metadata: {
                    author: "Tech Writer",
                    publishDate: "2025-10-02",
                    tags: ["nodejs", "javascript", "tutorial"],
                    category: "Programming",
                    readTime: "5 minutes",
                    featured: true
                }
            });

            expect(page.title).toBe("Getting Started with Node.js");
            expect(page.slug).toBe("getting-started-with-nodejs");
            expect(page.url).toBe("/getting-started-with-nodejs");
            expect(page.author).toBe("Tech Writer");
            expect(page.tags).toEqual(["nodejs", "javascript", "tutorial"]);
            expect(page.featured).toBe(true);
        });

        test('should handle home page example from existing code', () => {
            const page = new BloggifyPage({
                title: "Home",
                content: "Hey there!",
                metadata: {
                    customField: "Hello Mars!"
                }
            });

            expect(page.title).toBe("Home");
            expect(page.slug).toBe("home");
            expect(page.url).toBe("/home");
            expect(page.content).toBe("Hey there!");
            expect(page.customField).toBe("Hello Mars!");
            expect(page.raw_content).toBe("Hey there!");
        });

        test('should handle page with custom URL and slug', () => {
            const page = new BloggifyPage({
                title: "About Us",
                slug: "about",
                url: "/company/about",
                content: "Learn more about our company",
                metadata: {
                    section: "company",
                    priority: "high"
                }
            });

            expect(page.title).toBe("About Us");
            expect(page.slug).toBe("about");
            expect(page.url).toBe("/company/about");
            expect(page.section).toBe("company");
            expect(page.priority).toBe("high");
        });
    });
});