/**
 * Citation Formatter
 * Formats citations in various styles
 */
class CitationFormatter {
    /**
     * Format citations as markdown list
     * @param {Array<string>} citations - Array of citation URLs
     * @returns {string} Formatted citations
     */
    static formatMarkdown(citations) {
        if (!citations || citations.length === 0) {
            return '';
        }

        let formatted = '\n\n## References\n\n';

        citations.forEach((url, index) => {
            formatted += `${index + 1}. [${this.extractDomain(url)}](${url})\n`;
        });

        return formatted;
    }

    /**
     * Format citations as HTML list
     * @param {Array<string>} citations - Array of citation URLs
     * @returns {string} Formatted citations
     */
    static formatHTML(citations) {
        if (!citations || citations.length === 0) {
            return '';
        }

        let formatted = '\n<div class="citations">\n<h3>References</h3>\n<ol>\n';

        citations.forEach((url) => {
            formatted += `  <li><a href="${url}" target="_blank" rel="noopener">${this.extractDomain(url)}</a></li>\n`;
        });

        formatted += '</ol>\n</div>\n';

        return formatted;
    }

    /**
     * Format citations as plain text
     * @param {Array<string>} citations - Array of citation URLs
     * @returns {string} Formatted citations
     */
    static formatPlainText(citations) {
        if (!citations || citations.length === 0) {
            return '';
        }

        let formatted = '\n\nReferences:\n';

        citations.forEach((url, index) => {
            formatted += `[${index + 1}] ${url}\n`;
        });

        return formatted;
    }

    /**
     * Format citations as JSON
     * @param {Array<string>} citations - Array of citation URLs
     * @returns {Array<Object>} Formatted citations
     */
    static formatJSON(citations) {
        if (!citations || citations.length === 0) {
            return [];
        }

        return citations.map((url, index) => ({
            id: index + 1,
            url,
            domain: this.extractDomain(url),
            title: this.extractTitle(url)
        }));
    }

    /**
     * Extract domain from URL
     * @param {string} url - URL string
     * @returns {string} Domain name
     */
    static extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace('www.', '');
        } catch (error) {
            return url;
        }
    }

    /**
     * Extract title from URL (simple version)
     * @param {string} url - URL string
     * @returns {string} Title
     */
    static extractTitle(url) {
        try {
            const urlObj = new URL(url);
            const path = urlObj.pathname;
            const segments = path.split('/').filter(s => s);

            if (segments.length > 0) {
                const lastSegment = segments[segments.length - 1];
                return lastSegment
                    .replace(/[-_]/g, ' ')
                    .replace(/\.[^/.]+$/, '') // Remove extension
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            }

            return this.extractDomain(url);
        } catch (error) {
            return url;
        }
    }

    /**
     * Append citations to content
     * @param {string} content - Article content
     * @param {Array<string>} citations - Citation URLs
     * @param {string} format - Format type (markdown, html, plain)
     * @returns {string} Content with citations
     */
    static appendCitations(content, citations, format = 'markdown') {
        if (!citations || citations.length === 0) {
            return content;
        }

        let formattedCitations;

        switch (format.toLowerCase()) {
            case 'html':
                formattedCitations = this.formatHTML(citations);
                break;
            case 'plain':
                formattedCitations = this.formatPlainText(citations);
                break;
            case 'markdown':
            default:
                formattedCitations = this.formatMarkdown(citations);
                break;
        }

        return content + formattedCitations;
    }
}

export default CitationFormatter;
