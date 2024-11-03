'use client'

import { useEffect, useState } from 'react'
import { WebApp } from '@twa-dev/types'

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()

      const initData = tg.initData || ''
      const initDataUnsafe = tg.initDataUnsafe || {}

      if (initDataUnsafe.user) {
        fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(initDataUnsafe.user),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setError(data.error)
            } else {
              setUser(data)
            }
          })
          .catch((err) => {
            setError('Failed to fetch user data')
          })
      } else {
        setError('No user data available')
      }
    } else {
      setError('This app should be opened in Telegram')
    }
  }, [])

  const handleIncreasePoints = async () => {
    if (!user) return

    try {
      const res = await fetch('/api/increase-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramId: user.telegramId }),
      })
      const data = await res.json()
      if (data.success) {
        setUser({ ...user, points: data.points })
        setNotification('Points increased successfully!')
        setTimeout(() => setNotification(''), 3000)
      } else {
        setError('Failed to increase points')
      }
    } catch (err) {
      setError('An error occurred while increasing points')
    }
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  if (!user) return <div className="container mx-auto p-4">Loading...</div>

  return (
    <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.1/css/font-awesome.min.css"
  />
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
  />
  <title>GalaxyTon</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n        /* CSS content from style.css */\n        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');\n        .light-theme{ --body-color: #fff; --white-color: #000; --theme-color: #FF6431; --black-color: #fff; --search-color: #eeeeee; --fire-bubble: #faf8f8; --light-grey: #f2f2f2; --deam-white: #000 }\n        .dark-theme{ --body-color: #141217; --white-color: #fff; --theme-color: #FF6431; --black-color: #000; --search-color: #272933; --fire-bubble: rgba(59, 65, 79, 0.5); --light-grey: rgba(90, 94, 104, 0.5); --deam-white: rgba(255, 255, 255, 0.5) }\n        /* (The rest of the CSS content goes here...) */\n    "
    }}
  />
  <header>
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="header-inner d-flex justify-content-between align-items-center">
          <a className="navbar-brand flex-shrink-0" href="#">
            {" "}
            Big Farm{" "}
          </a>
          <div className="header-content d-flex align-items-center justify-content-end">
            <form className="d-flex justify-content-end align-items-center">
              <div className="search-icon">
                <i className="fa fa-search" aria-hidden="true" />
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
              </div>
              <label className="switch flex-shrink-0 mb-0">
                <input id="checkbox" type="checkbox" />
                <span className="slider round" />
              </label>
            </form>
            <a href="#" className="profile">
              <img
                src="https://yudiz.com/codepen/nft-store/user-pic1.svg"
                alt="user-image"
              />
              User123
            </a>
            <a href="#" className="notification">
              <i className="fa fa-bell" aria-hidden="true" />
            </a>
          </div>
        </div>
        <button className="hamburger-icon">
          <span />
          <span />
          <span />
        </button>
      </nav>
    </div>
  </header>
  <div className="nft-store">
    <div className="container-fluid">
      <div className="nft-store-inner d-flex">
        <div className="menu-links">
          <ul>
            <li className="nav-item active">
              <a href="#" className="d-flex align-items-center nav-link">
                <i className="fa fa-home" aria-hidden="true" />
                <span>Home</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="d-flex align-items-center nav-link">
                <i className="fa fa-tasks" aria-hidden="true" />
                <span>Tasks</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                href="dailylogin.html"
                className="d-flex align-items-center nav-link"
              >
                <i className="fa fa-calendar" aria-hidden="true" />
                <span>Daily Login</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                href="https://mywallet-blue.vercel.app/"
                className="d-flex align-items-center nav-link"
              >
                <i className="fa fa-credit-card" aria-hidden="true" />
                <span>Wallet Connect</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                href="Invite.html"
                className="d-flex align-items-center nav-link"
              >
                <i className="fa fa-money" aria-hidden="true" />
                <span>Friends</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="d-flex align-items-center nav-link">
                <i className="fa fa-star" aria-hidden="true" />
                <span>Leaderboard</span>
              </a>
            </li>
          </ul>
        </div>
        <div id="quiz-container">
          <div id="question-container">
            <h2 id="question">Question</h2>
            <ul id="answer-buttons">
              <li>
                <button className="answer-btn">Answer 1</button>
              </li>
              <li>
                <button className="answer-btn">Answer 2</button>
              </li>
              <li>
                <button className="answer-btn">Answer 3</button>
              </li>
              <li>
                <button className="answer-btn">Answer 4</button>
              </li>
            </ul>
          </div>
          <div id="controls">
            <button id="next-btn" className="hide">
              Next
            </button>
            <p id="score">Score: 0</p>
          </div>
          <div id="daily-login-score">Daily Login Points: 0</div>
          <div id="quiz-score">Quiz Points: 0</div>
          <div id="combined-score">Total Score: 0</div>
        </div>
      </div>
    </div>
  </div>
</>

  )
}