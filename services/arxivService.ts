
import { Paper } from '../types';

// A simple utility to get text content from an XML element
const getElementText = (element: Element, tagName:string): string => {
  const node = element.querySelector(tagName);
  return node?.textContent?.trim() || '';
};

const parseEntry = (entry: Element): Paper => {
    const id = getElementText(entry, 'id');
    const title = getElementText(entry, 'title').replace(/\s+/g, ' ');
    const summary = getElementText(entry, 'summary').replace(/\s+/g, ' ');
    const published = getElementText(entry, 'published');

    const authors = Array.from(entry.querySelectorAll('author')).map(author => 
        getElementText(author, 'name')
    );

    const categories = Array.from(entry.querySelectorAll('category')).map(cat => 
        cat.getAttribute('term') || ''
    );
    
    const pdfLinkNode = Array.from(entry.querySelectorAll('link')).find(
        link => link.getAttribute('title') === 'pdf'
    );
    const pdfUrl = pdfLinkNode?.getAttribute('href') || id.replace('/abs/', '/pdf/');

    return { id, title, authors, summary, pdfUrl, categories, published };
};

// Generic function to execute a query and parse the response
const executeArxivQuery = async (query: string): Promise<Paper[]> => {
  const baseUrl = 'https://export.arxiv.org/api/query';
  const url = `${baseUrl}?${query}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch from arXiv API: ${response.statusText}`);
    }
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    
    const errorNode = xmlDoc.querySelector("parsererror");
    if (errorNode) {
        throw new Error("Failed to parse XML response from arXiv.");
    }
    
    const entries = Array.from(xmlDoc.querySelectorAll('entry'));
    if (entries.length === 0) {
        console.warn("No papers found in the arXiv response for this query.");
        return [];
    }

    return entries.map(parseEntry);
  } catch (error) {
    console.error("Error fetching or parsing arXiv data:", error);
    throw new Error("Could not retrieve papers from arXiv. Please check your network connection.");
  }
};

export const fetchRecentPapers = async (start: number = 0, maxResults: number = 15): Promise<Paper[]> => {
  const query = `search_query=cat:astro-ph.*&sortBy=submittedDate&sortOrder=descending&start=${start}&max_results=${maxResults}`;
  return executeArxivQuery(query);
};

// Helper to format date for the arXiv API query (YYYYMMDDHHMMSS)
const formatDateForApi = (date: Date, endOfDay: boolean = false): string => {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const time = endOfDay ? '235959' : '000000';
  return `${year}${month}${day}${time}`;
};

export const fetchPapersByDate = async (date: Date, start: number = 0, maxResults: number = 15): Promise<Paper[]> => {
  const startDateString = formatDateForApi(date, false);
  const endDateString = formatDateForApi(date, true);
  
  const query = `search_query=cat:astro-ph.*+AND+submittedDate:[${startDateString} TO ${endDateString}]&sortBy=submittedDate&sortOrder=descending&start=${start}&max_results=${maxResults}`;
  return executeArxivQuery(query);
};
