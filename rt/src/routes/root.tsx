import React, { useState, useEffect, useCallback } from "react";
import { NavLink, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../Pagination";  // Импортируем компонент Pagination
import { Person } from "../interfaces";
import SearchSection from "../components/SearchSection"; // Импортируем компонент SearchSection
import ProfilePage from "../components/ProfilePage";  // Импортируем компонент ProfilePage


const Root: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const detailsFromUrl = searchParams.get("details");

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  const fetchPeople = useCallback(() => {
    setLoading(true);
    const query = searchTerm.trim() ? `?search=${searchTerm.trim()}&page=${currentPage}` : `?page=${currentPage}`;

    fetch(`https://swapi.dev/api/people/${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPeople(data.results || []);
        setTotalPages(Math.ceil(data.count / 10));  // Обновляем количество страниц на основе общего количества персонажей
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchTerm, currentPage]);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  const handleInputChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    setSearchParams({ page: "1" });
  };

  const handleSearch = () => {
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm) {
      setCurrentPage(1);
      setSearchParams({ page: "1" });
      fetchPeople();
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSearchParams({ page: page.toString() });
    }
  };

  const handleCloseDetails = () => {
    setSearchParams({ page: currentPage.toString() });
  };

  return (
    <div className="app">
    <div className="column">
      <SearchSection
        searchTerm={searchTerm}
        onSearchTermChange={handleInputChange}
        onSearch={handleSearch}
      />
      <div className="results-section">
        {loading ? (
          <>
            <div className="loader-text">Loading...</div>
            <div className="loader"></div>
          </>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="results-cont">
            <div className="results-names">
              {people.map((person) => (
                <NavLink
                  key={person.name}
                  to={`/?page=${currentPage}&details=${encodeURIComponent(person.name)}`}
                  className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}
                >
                  {person.name}
                </NavLink>
              ))}
            </div>
            {detailsFromUrl && (
              <div className="details-section">
                <button className="close-btn" onClick={handleCloseDetails}>Close</button>
                <ProfilePage name={detailsFromUrl} />
              </div>
            )}
          </div>
        )}
      </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Root;
