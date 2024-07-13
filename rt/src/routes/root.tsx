// import React, { useState, useEffect, useCallback } from "react";
// import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
// import Pagination from "../Pagination";
// import { Person } from "../interfaces";
// import SearchSection from "../components/SearchSection";
// import ProfilePage from "../components/ProfilePage";
// import useLocalStorage from "../hooks/useLocalStorage"; 

// const Root: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState(""); 
//   const [people, setPeople] = useState<Person[]>([]); 
//   const [error, setError] = useState<string | null>(null); 
//   const [loading, setLoading] = useState<boolean>(false); 
//   const [totalPages, setTotalPages] = useState<number>(1); 
//   const [currentPage, setCurrentPage] = useState<number>(1); 

//   const [storedSearchTerm, setStoredSearchTerm] = useLocalStorage("searchTerm", "");

//   const location = useLocation();
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
//   const detailsFromUrl = searchParams.get("details");
//   const searchQuery = searchParams.get("search") || "";

//   useEffect(() => {
//     setCurrentPage(pageFromUrl);
//   }, [pageFromUrl]);

//   const fetchPeople = useCallback(() => {
//     setLoading(true);
//     const query = searchQuery.trim() ? `?search=${searchQuery.trim()}&page=${currentPage}` : `?page=${currentPage}`;

//     console.log(`Fetching people with searchTerm: "${searchQuery}" and page: ${currentPage}`);

//     fetch(`https://swapi.dev/api/people/${query}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setPeople(data.results || []);
//         setTotalPages(Math.ceil(data.count / 10));
//         setError(null);
//       })
//       .catch((error) => {
//         setError(error.message);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [searchQuery, currentPage]);

//   useEffect(() => {
//     fetchPeople();
//   }, [fetchPeople]);

//   const handleInputChange = (term: string) => {
//     setSearchTerm(term); 
//   };

//   const handleSearch = () => {
//     const trimmedSearchTerm = searchTerm.trim();
//     if (trimmedSearchTerm) {
//       setSearchParams({ search: trimmedSearchTerm, page: "1" }); 
//       setStoredSearchTerm(trimmedSearchTerm); 
//     } else {
//       setSearchParams({ page: "1" }); 
//       setStoredSearchTerm(""); 
//     }
//     setCurrentPage(1); 
//   };

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//       setSearchParams({ search: searchTerm.trim(), page: page.toString() }); 
//     }
//   };

//   const handleCloseDetails = () => {
//     setSearchParams({ search: searchQuery, page: currentPage.toString() }); 
//   };

//   useEffect(() => {
//     setSearchTerm(storedSearchTerm);
//   }, [storedSearchTerm]);

//   return (
//     <div className="app">
//       <div className="column sidebar">
//         <SearchSection
//           searchTerm={searchTerm}
//           onSearchTermChange={handleInputChange} 
//           onSearch={handleSearch} 
//         />
//         <div className="results-section">
//           {loading ? (
//             <>
//               <div className="loader-text">Loading...</div>
//               <div className="loader"></div>
//             </>
//           ) : error ? (
//             <p className="error">{error}</p>
//           ) : (
//             <>
//               <div className="results-cont">
//                 <div className="results-names">
//                   {people.map((person) => (
//                     <NavLink
//                       key={person.name}
//                       to={`/?search=${searchQuery}&page=${currentPage}&details=${encodeURIComponent(person.name)}`}
//                       className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}
//                     >
//                       {person.name}
//                     </NavLink>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//         <div className="hide-div" onClick={handleCloseDetails}>
//         </div>
//       </div>
//       {detailsFromUrl && (
//         <div className="details-section">
//           <button className="close-btn" onClick={handleCloseDetails}>Close</button>
//           <ProfilePage name={detailsFromUrl} />
//         </div>
//       )}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={handlePageChange}
//       />
//     </div>
//   );
// };

// export default Root;


import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '../Pagination';
import { Person } from '../interfaces';
import SearchSection from '../components/SearchSection';
import ProfilePage from '../components/ProfilePage';
import useLocalStorage from '../hooks/useLocalStorage';
import CardList from '../components/CardList';

const Root: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [storedSearchTerm, setStoredSearchTerm] = useLocalStorage('searchTerm', '');

  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const detailsFromUrl = searchParams.get('details');
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  const fetchPeople = useCallback(() => {
    setLoading(true);
    const query = searchQuery.trim() ? `?search=${searchQuery.trim()}&page=${currentPage}` : `?page=${currentPage}`;

    fetch(`https://swapi.dev/api/people/${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setPeople(data.results || []);
        setTotalPages(Math.ceil(data.count / 10));
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchQuery, currentPage]);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  const handleInputChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleSearch = () => {
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm) {
      setSearchParams({ search: trimmedSearchTerm, page: '1' });
      setStoredSearchTerm(trimmedSearchTerm);
    } else {
      setSearchParams({ page: '1' });
      setStoredSearchTerm('');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSearchParams({ search: searchTerm.trim(), page: page.toString() });
    }
  };

  const handleCloseDetails = () => {
    setSearchParams({ search: searchQuery, page: currentPage.toString() });
  };

  useEffect(() => {
    setSearchTerm(storedSearchTerm);
  }, [storedSearchTerm]);

  return (
    <div className="app">
      <div className="column sidebar">
        <SearchSection searchTerm={searchTerm} onSearchTermChange={handleInputChange} onSearch={handleSearch} />
        {loading ? (
          <>
            <div className="loader-text">Loading...</div>
            <div className="loader"></div>
          </>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <CardList people={people} searchQuery={searchQuery} currentPage={currentPage} />
        )}
      </div>
      {detailsFromUrl && (
        <div className="details-section">
          <button className="close-btn" onClick={handleCloseDetails}>
            Close
          </button>
          <ProfilePage name={detailsFromUrl} />
        </div>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default Root;

