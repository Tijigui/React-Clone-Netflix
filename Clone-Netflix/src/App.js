import React, { useEffect, useState } from "react";
import Tmdb from './Tmdb';
import './App.css';
import MovieRow from "./components/MovieRow/MovieRow";
import FeaturedMovie from "./components/FeaturedMovie/FeaturedMovie";
import Header from "./components/Header/Header";

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setfeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(true);



  useEffect(() => {
    const loadAll = async () => {
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      let originals = list.filter(i => i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setfeaturedData(chosenInfo);
    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      }
      else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, [])

  return (
    <div className="page">

      <Header black={blackHeader} />

      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        <p className="footer--paragraph">Feito com <span role="img" aria-label="coração">❤️</span>por <a href="https://linktr.ee/tijigui" target="_blank">Thiago Guimaraes</a>.</p>

        <p className="footer--paragraph">Direitos de imagem para <a className="footer--netflix" href="https://www.netflix.com/browse" target="_blank">Netflix</a></p>

        <p className="footer--paragraph">Dados pegos do site <a className="footer--tmdb" href="https://www.themoviedb.org/" target="_blank">Themoviedb.org</a></p>
      </footer>

      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://c.tenor.com/DQyztbEmqnYAAAAC/netflix-loading.gif" alt="Carregando" />
        </div>
      }

    </div>
  );
}