export function checkRelevance(query: string): boolean {
  // Phase 2: Deterministic Relevance Firewall
  // Ensures the AI only processes queries related to Anant Kumar, his projects, skills, or professional experience.
  
  if (!query || query.trim().length === 0) return false;
  
  const lowercaseQuery = query.toLowerCase();
  
  // Basic heuristic list (can be expanded into embedding-based firewall in Phase 3)
  const allowedKeywords = [
    'anant', 'kumar', 'project', 'skill', 'experience', 'work', 
    'portfolio', 'hire', 'resume', 'cv', 'build', 'create', 
    'know', 'who', 'what', 'where', 'how', 'hi', 'hello', 'hey',
    'contact', 'email', 'github', 'linkedin', 'twitter', 'x',
    'hobby', 'hobbies', 'book', 'read', 'client', 'education',
    'about', 'you', 'your', 'life', 'story', 'journey', 'tech'
  ];

  // If the query contains any allowed keyword, it passes the firewall
  return allowedKeywords.some(keyword => lowercaseQuery.includes(keyword));
}
