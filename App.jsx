import { useEffect, useState } from 'react'
import './App.css'

const news = [
  {
    category: 'HABARI ZA SOKA',
    title: 'Karibu SOKA AFRIKA!',
    text: 'Pata habari, matokeo na taarifa za soka kwa lugha ya Kiswahili.',
  },
  {
    category: 'UCHAMBUZI',
    title: 'Jifunze kuelewa mchezo',
    text: 'Fuata uchambuzi wa mechi, mbinu za timu na nyota wa soka.',
  },
]

function App() {
  const [page, setPage] = useState('Home')
  const [language, setLanguage] = useState('sw')
  const [selectedMatch, setSelectedMatch] = useState(null)
    const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    fetch('/.netlify/functions/livescore')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load matches')
        return response.json()
      })
      .then((data) => {
        if (data.success !== 1) throw new Error('Football data unavailable')

        const liveMatches = (data.result || []).map((event) => ({
          league: event.league_name || 'FOOTBALL',
          home: event.event_home_team,
          away: event.event_away_team,
          homeScore: event.event_final_result
            ? Number(event.event_final_result.split(' - ')[0])
            : null,
          awayScore: event.event_final_result
            ? Number(event.event_final_result.split(' - ')[1])
            : null,
          status: event.event_live === '1' ? 'LIVE' : 'FINISHED',
        }))

        setMatches(liveMatches)
      })
      .catch(() => setApiError('Could not load football matches.'))
      .finally(() => setLoading(false))
  }, [])

  const kiswahili = language === 'sw'

  return (
    <div className="site">
      <header className="header">
        <a className="brand" href="#home"
          onClick={() => {
            setPage('Home')
            setSelectedMatch(null)
          }}>
          <span className="brand-ball">⚽</span>
          <span>
            <strong>SOKA AFRIKA</strong>
            <small>{kiswahili ? 'NYUMBANI PA SOKA' : 'HOME OF FOOTBALL'}</small>
          </span>
        </a>

        <button
          className="language"
          onClick={() => setLanguage(kiswahili ? 'en' : 'sw')}
        >
          {kiswahili ? 'EN' : 'SW'}
        </button>
      </header>

      <nav className="nav">
        {['Home', 'Matches', 'News'].map((item) => (
          <button
            key={item}
            className={page === item ? 'nav-link active' : 'nav-link'}
            onClick={() => {
              setPage(item)
              setSelectedMatch(null)
            }}
          >
            {item === 'Home'
              ? kiswahili ? 'Nyumbani' : 'Home'
              : item === 'Matches'
                ? kiswahili ? 'Mechi' : 'Matches'
                : kiswahili ? 'Habari' : 'News'}
          </button>
        ))}
      </nav>

      <main>
        {page === 'Home' && (
          <>
            <section className="hero" id="home">
              <div className="hero-label">
                <span className="live-dot" />
                {kiswahili ? 'DUNIA YA SOKA' : 'THE WORLD OF FOOTBALL'}
              </div>

              <h1>
                {kiswahili
                  ? 'Soka la Afrika, kwa lugha yetu.'
                  : 'African football, in our language.'}
              </h1>

              <p>
                {kiswahili
                  ? 'Habari, matokeo na uchambuzi wa soka kwa Kiswahili.'
                  : 'Football news, scores and analysis in English.'}
              </p>

              <button
                className="primary-button"
                onClick={() => setPage('Matches')}
              >
                {kiswahili ? 'Ona Mechi' : 'Explore Matches'} →
              </button>
            </section>

            <section className="section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    {kiswahili ? 'UWANJANI' : 'ON THE PITCH'}
                  </span>
                  <h2>{kiswahili ? 'Mechi za Mfano' : 'Sample Matches'}</h2>
                </div>
                <button className="text-button"
                  onClick={() => setPage('Matches')}>
                  {kiswahili ? 'Zote →' : 'View all →'}
                </button>
              </div>

          {loading && <p className="muted">Inapakia mechi...</p>}

{apiError && <p className="demo-note">{apiError}</p>}

{!loading && !apiError && matches.length === 0 && (
  <p className="muted">Hakuna mechi zinazopatikana kwa sasa.</p>
)}

{!loading && matches.slice(0, 2).map((match, index) => (
  <MatchCard
    key={match.home}
    match={match}
    kiswahili={kiswahili}
    onClick={() => {
      setSelectedMatch(index)
      setPage('Matches')
    }}
  />
))}
        
            </section>

            <Commentary kiswahili={kiswahili} />
            <NewsSection kiswahili={kiswahili} />
          </>
        )}

        {page === 'Matches' && (
          <section className="section page-section">
            <span className="eyebrow">
              {kiswahili ? 'MATOKEO NA RATIBA' : 'SCORES & FIXTURES'}
            </span>
            <h1>{kiswahili ? 'Mechi za Soka' : 'Football Matches'}</h1>
            <p className="muted">
              {kiswahili
                ? 'Chagua mechi kuona maelezo na mfano wa maoni ya Kiswahili.'
                : 'Select a match to see details and sample Kiswahili commentary.'}
            </p>

            {matches.map((match, index) => (
              <MatchCard
                key={match.home}
                match={match}
                kiswahili={kiswahili}
                onClick={() =>
                  setSelectedMatch(selectedMatch === index ? null : index)
                }
              />
            ))}

            {selectedMatch !== null && (
              <div className="commentary-box">
                <h3>
                  {matches[selectedMatch].home} dhidi ya{' '}
                  {matches[selectedMatch].away}
                </h3>
                <p>
                  {matches[selectedMatch].status === 'UPCOMING'
                    ? 'Karibu kwenye mechi! Timu zote zinajiandaa kwa mchezo. Fuata hapa kwa maelezo ya mfano.'
                    : 'Mchezo unaendelea kwa kasi! Timu zote zinatafuta nafasi za kufunga. Haya ni maoni ya mfano, si matangazo ya moja kwa moja.'}
                </p>
              </div>
            )}
            <p className="demo-note">
              {kiswahili
                ? 'Taarifa za mechi ni za mfano.'
                : 'All match information is sample data.'}
            </p>
          </section>
        )}

        {page === 'News' && (
          <section className="section page-section">
            <span className="eyebrow">SOKA AFRIKA</span>
            <h1>{kiswahili ? 'Habari za Soka' : 'Football News'}</h1>
            <NewsSection kiswahili={kiswahili} />
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="footer-brand">⚽ SOKA AFRIKA</div>
        <p>
          {kiswahili
            ? 'Soka letu. Lugha yetu. ❤️'
            : 'Our football. Our language. ❤️'}
        </p>
        <small>© 2026 SOKA AFRIKA · Demo website</small>
      </footer>
    </div>
  )
}

function MatchCard({ match, kiswahili, onClick }) {
  return (
    <button className="match-card" onClick={onClick}>
      <div className="match-top">
        <span>{match.league}</span>
      <span className={
  match.status === 'LIVE'
    ? 'live'
    : match.status === 'UPCOMING'
      ? 'upcoming'
      : 'finished'
}>
  {match.status === 'LIVE'
    ? kiswahili ? 'LIVE' : 'LIVE'
    : match.status === 'UPCOMING'
      ? kiswahili ? 'IJAYO' : 'UPCOMING'
      : kiswahili ? 'IMEISHA' : 'FULL TIME'}
</span>
      </div>

      <div className="teams">
        <div className="team">
          <span className="team-ball">⚽</span>
          <strong>{match.home}</strong>
        </div>
        <div className="score">
          {match.homeScore === null
            ? 'VS'
            : `${match.homeScore} - ${match.awayScore}`}
        </div>
        <div className="team away">
          <span className="team-ball">⚽</span>
          <strong>{match.away}</strong>
        </div>
      </div>

      <div className="match-bottom">
        {kiswahili ? 'Gusa kuona maelezo' : 'Tap to see details'} →
      </div>
    </button>
  )
}

function Commentary({ kiswahili }) {
  return (
    <section className="commentary-section">
      <div className="commentary-icon">🎙️</div>
      <span className="eyebrow">
        {kiswahili ? 'LUGHA YETU' : 'OUR LANGUAGE'}
      </span>
      <h2>
        {kiswahili ? 'Soka kwa Kiswahili' : 'Football in Kiswahili'}
      </h2>
      <p>
        {kiswahili
          ? 'Fikiria kusikiliza maelezo ya mechi kwa lugha unayoielewa vizuri.'
          : 'Imagine following match commentary in a language you understand.'}
      </p>
      <div className="quote">
        “Mpira unapigwa pembeni, mshambuliaji anakimbia kuelekea langoni!”
      </div>
      <small>
        {kiswahili
          ? 'Mfano wa maandishi tu — si sauti ya moja kwa moja.'
          : 'Text example only — no live audio yet.'}
      </small>
    </section>
  )
}

function NewsSection({ kiswahili }) {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            {kiswahili ? 'HABARI MPYA' : 'LATEST STORIES'}
          </span>
          <h2>{kiswahili ? 'Habari na Uchambuzi' : 'News & Analysis'}</h2>
        </div>
      </div>

      {news.map((item) => (
        <article className="news-card" key={item.title}>
          <span className="news-icon">⚽</span>
          <div>
            <span className="eyebrow">{item.category}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        </article>
      ))}
    </section>
  )
}

export default App
