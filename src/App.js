import "./App.css";
import { useState, useEffect, useRef, memo } from "react";
import { flushSync } from 'react-dom'
const fetchResults = async function (pageIndex) {
  const response = await fetch(
    `https://randomuser.me/api?results=1&page=${pageIndex}`
  );
  const res = await response.json();
  return res.results;
};

const UsersList = memo(function UsersList({users}) {
  return users.map(user => <UserInfo key={user.login.uuid} info={user} />)
});

function UserInfo({ info }) {
  const name = `${info.name.first} ${info.name.last}`;
  const imgSrc = info.picture.thumbnail;
  return (
    <p className="user-title">
      <img className="user-img" src={imgSrc} alt={`${name} profile`} />
      <span>{name}</span>
    </p>
  );
}

export default function App() {
  const [results, setResults] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  const userListRef = useRef(null);
  useEffect(() => {
    let ignore = false;
    (async function () {
      const newRes = await fetchResults(pageIndex);
      if (!ignore) {
        setResults((r) => [...r, ...newRes]);
        setIsLoading(false);
      }
    })();
    return () => (ignore = true);
  }, [pageIndex]);

  function handlePagination() {
    flushSync(() => {
      setPageIndex(p => p+1);
      setIsLoading(true);
    });
    userListRef.current.lastChild.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
  }
  return (
    <div className={`App ${theme}`}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="btn">Change Theme</button>
      <div ref={userListRef} className="user-info">
        <UsersList users={results} />
        {isLoading && [1, 2].map(i => (<div key={i} className="glimmer-container">
          <div className="glimmer glimmer-1"></div>
          <div className="glimmer glimmer-2"></div>
        </div>))}
      </div>
      <button className="btn" disabled={isLoading} onClick={handlePagination}>Load More </button>
    </div>
  );
}