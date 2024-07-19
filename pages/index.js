import { useState, useEffect } from 'react';
import topUniversitiesData from '../data/topUniversities.json';

export default function Universities() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [universities, setUniversities] = useState([]);
  const [error, setError] = useState(null);
  const [topUniversities, setTopUniversities] = useState([]);
  const [selectedTopCountry, setSelectedTopCountry] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const sortedCountries = data
          .map(country => country.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(sortedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    }

    fetchCountries();
  }, []);

  const handleFindClick = async () => {
    if (!selectedCountry) {
      setError('Please select a country');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/universities?country=${selectedCountry}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUniversities(data);
      setError(null);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to fetch universities');
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTopCountryChange = (country) => {
    setLoading(true);
    setSelectedTopCountry(country);
    setTopUniversities(topUniversitiesData[country] || []);
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex-grow">
        <h1 className="text-3xl font-bold text-center mb-6">University Finder</h1>
        
        {/* University Finder Section */}
        <div className="mb-8 flex flex-col items-center space-y-4">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Select a Country</span>
            </label>
            <select
              className="select select-bordered w-full"
              onChange={(e) => setSelectedCountry(e.target.value)}
              value={selectedCountry}
            >
              <option value="">Select a country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="text-center">
            <button
              className="btn btn-primary mt-4"
              onClick={handleFindClick}
            >
              Find Universities
            </button>
          </div>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>

        <div className="mb-8">
          {universities.length > 0 ? (
            <div className="overflow-x-auto transition-all duration-500 ease-in-out">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Country</th>
                    <th>State/Province</th>
                    <th>Domains</th>
                  </tr>
                </thead>
                <tbody>
                  {universities.map((uni, index) => (
                    <tr key={index}>
                      <td className="font-semibold">{uni.name}</td>
                      <td>{uni.alpha_two_code}</td>
                      <td>{uni.country}</td>
                      <td>{uni['state-province'] || 'N/A'}</td>
                      <td>
                        {uni.domains.length > 0 ? (
                          <ul className="list-disc pl-5">
                            {uni.domains.map((domain, domainIndex) => (
                              <li key={domainIndex}>
                                <a href={`http://${domain}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {domain}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No domains available</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !error && <p className="text-center">No universities found.</p>
          )}
        </div>

        {/* Top Universities Per Country Section */}
        <h2 className="text-2xl font-bold text-center mb-6">Top Universities Per Country</h2>
        <div className="mb-6 flex flex-wrap justify-center gap-4">
          {['USA', 'Canada', 'China', 'Japan', 'South Korea', 'Singapore', 'Hong Kong', 'Taiwan', 'Philippines', 'Indonesia', 'Malaysia', 'Vietnam'].map(country => (
            <button
              key={country}
              className={`btn ${selectedTopCountry === country ? 'btn-primary' : 'btn-secondary'} mb-2`}
              onClick={() => handleTopCountryChange(country)}
            >
              {country}
            </button>
          ))}
        </div>
        <div className="transition-opacity duration-500 ease-in-out">
          {loading ? (
            <div className="text-center mt-4">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            topUniversities.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th style={{ width: '10%' }}>Rank</th>
                      <th style={{ width: '40%' }}>Name</th>
                      <th style={{ width: '20%' }}>City</th>
                      <th style={{ width: '20%' }}>State/Province</th>
                      <th style={{ width: '10%' }}>Website</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topUniversities.map((uni, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="font-semibold">{uni.name}</td>
                        <td>{uni.city || 'N/A'}</td>
                        <td>{uni.state || 'N/A'}</td>
                        <td>
                          {uni.website ? (
                            <a href={`http://${uni.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {uni.website}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center">Select a country to see top universities.</p>
            )
          )}
        </div>
      </div>

      <footer className="text-center mt-6">
        <p className="text-sm text-gray-500">© 2024 University Finder. All rights reserved.</p>
      </footer>
    </div>
  );
}
