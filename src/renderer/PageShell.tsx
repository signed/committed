import React from 'react'
import logo from './logo.svg'
import { PageContextProvider } from './usePageContext'
import type { PageContext } from './types'
import './PageShell.css'
import { Link } from './Link'
import { client } from '../../trpc/client'

export function PageShell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  const onSync = async () => {
    await client.project.sync.mutate()
    window.location.reload()
  }
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Layout>
          <Sidebar>
            <Logo />
            <button onClick={onSync}>sync</button>
            <Link className="navitem" href="/">
              Home
            </Link>
            <Link className="navitem" href="/about">
              About
            </Link>
            <Link className="navitem" href="/clipboard">
              Clipboard
            </Link>
          </Sidebar>
          <Content>{children}</Content>
        </Layout>
      </PageContextProvider>
    </React.StrictMode>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        maxWidth: 900,
        margin: 'auto',
      }}
    >
      {children}
    </div>
  )
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: '1.8em',
      }}
    >
      {children}
    </div>
  )
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        paddingBottom: 50,
        borderLeft: '2px solid #eee',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  )
}

function Logo() {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10,
      }}
    >
      <a href="/">
        <img src={logo} height={64} width={64} alt="logo" />
      </a>
    </div>
  )
}
