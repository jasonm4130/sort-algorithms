import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { ThemeToggle } from './ThemeToggle.tsx'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('ThemeToggle', () => {
  it('renders a button with an accessible label', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')
    expect(btn).toBeTruthy()
    expect(btn.getAttribute('aria-label')).toMatch(/theme/i)
  })

  it('toggles data-theme attribute on click', async () => {
    localStorage.setItem('theme', 'dark')
    render(<ThemeToggle />)
    expect(screen.getByLabelText(/switch to light/i)).toBeTruthy()

    await userEvent.click(screen.getByRole('button'))
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('persists theme to localStorage on toggle', async () => {
    localStorage.setItem('theme', 'dark')
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button'))
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
