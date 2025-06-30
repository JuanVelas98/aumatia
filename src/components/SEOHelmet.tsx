
import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}

export const SEOHelmet = ({ 
  title, 
  description, 
  ogTitle, 
  ogDescription, 
  ogImage, 
  ogUrl 
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', description);
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
    }
    
    // Update og:title
    const ogTitleMeta = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitleMeta.setAttribute('property', 'og:title');
    ogTitleMeta.setAttribute('content', ogTitle || title);
    if (!document.querySelector('meta[property="og:title"]')) {
      document.head.appendChild(ogTitleMeta);
    }
    
    // Update og:description
    const ogDescMeta = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDescMeta.setAttribute('property', 'og:description');
    ogDescMeta.setAttribute('content', ogDescription || description);
    if (!document.querySelector('meta[property="og:description"]')) {
      document.head.appendChild(ogDescMeta);
    }
    
    // Update og:image
    if (ogImage) {
      const ogImageMeta = document.querySelector('meta[property="og:image"]') || document.createElement('meta');
      ogImageMeta.setAttribute('property', 'og:image');
      ogImageMeta.setAttribute('content', ogImage);
      if (!document.querySelector('meta[property="og:image"]')) {
        document.head.appendChild(ogImageMeta);
      }
    }
    
    // Update og:url
    if (ogUrl) {
      const ogUrlMeta = document.querySelector('meta[property="og:url"]') || document.createElement('meta');
      ogUrlMeta.setAttribute('property', 'og:url');
      ogUrlMeta.setAttribute('content', ogUrl);
      if (!document.querySelector('meta[property="og:url"]')) {
        document.head.appendChild(ogUrlMeta);
      }
    }
  }, [title, description, ogTitle, ogDescription, ogImage, ogUrl]);
  
  return null;
};
