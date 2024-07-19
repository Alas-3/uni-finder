export default async function handler(req, res) {
    const { country, region } = req.query;
  
    try {
      // Replace with the actual API URL
      const apiUrl = `https://www.4icu.org/api/universities?country=${country}&region=${region}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch data' });
      }
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  }
  