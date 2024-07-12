import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../Pagination";
import { Person } from "../interfaces";
import SearchSection from "../components/SearchSection";
import ProfilePage from "../components/ProfilePage";
import useLocalStorage from "../hooks/useLocalStorage";  // Импортируем кастомный хук

const Root: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");  // Хранит текущий текст поиска
  const [people, setPeople] = useState<Person[]>([]);  // Хранит данные о людях
  const [error, setError] = useState<string | null>(null);  // Хранит информацию об ошибке
  const [loading, setLoading] = useState<boolean>(false);  // Хранит состояние загрузки данных
  const [totalPages, setTotalPages] = useState<number>(1);  // Хранит общее количество страниц
  const [currentPage, setCurrentPage] = useState<number>(1);  // Хранит текущую страницу

  // Используем кастомный хук для сохранения и получения searchTerm из localStorage
  const [storedSearchTerm, setStoredSearchTerm] = useLocalStorage("searchTerm", "");

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const detailsFromUrl = searchParams.get("details");
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  const fetchPeople = useCallback(() => {
    setLoading(true);
    const query = searchQuery.trim() ? `?search=${searchQuery.trim()}&page=${currentPage}` : `?page=${currentPage}`;

    console.log(`Fetching people with searchTerm: "${searchQuery}" and page: ${currentPage}`);

    fetch(`https://swapi.dev/api/people/${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
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

  // Функция обработки ввода текста
  const handleInputChange = (term: string) => {
    setSearchTerm(term);  // Обновляем searchTerm при изменении текста
  };

  // Функция обработки нажатия на кнопку поиска
  const handleSearch = () => {
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm) {
      setSearchParams({ search: trimmedSearchTerm, page: "1" });  // Обновляем URL с новым поисковым запросом
      setStoredSearchTerm(trimmedSearchTerm);  // Сохраняем поисковый запрос в localStorage
    } else {
      setSearchParams({ page: "1" });  // Если пустой поисковый запрос, очищаем параметры поиска
    }
    setCurrentPage(1);  // Устанавливаем текущую страницу на 1 при новом поиске
  };

  // Функция обработки изменения страницы
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSearchParams({ search: searchTerm.trim(), page: page.toString() });  // Обновляем URL при изменении страницы
    }
  };

  // Функция обработки закрытия деталей
  const handleCloseDetails = () => {
    setSearchParams({ page: currentPage.toString() });  // Обновляем URL при закрытии деталей
  };

  // Устанавливаем searchTerm из localStorage при загрузке компонента
  useEffect(() => {
    setSearchTerm(storedSearchTerm);
  }, [storedSearchTerm]);

  return (
    <div className="app">
      <div className="column sidebar">
        <SearchSection
          searchTerm={searchTerm}
          onSearchTermChange={handleInputChange}  // Обновляем searchTerm при вводе текста
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
            <>
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
              </div>
            </>
          )}
        </div>
      </div>
      {detailsFromUrl && (
        <div className="details-section">
          <button className="close-btn" onClick={handleCloseDetails}>Close</button>
          <ProfilePage name={detailsFromUrl} />
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Root;
