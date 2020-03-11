import 'isomorphic-fetch'
import { timedFetch, TimeoutError } from '../src/timedFetch'

describe('timedFetch', () => {
  it('succeds on a prompt response', async () => {
    const mockFetch = jest.fn(
      (..._) => new Promise<Response>(
        (resolver) =>
          setTimeout(() => resolver(new Response('body')),
        )
      )
    )

    const fetch = timedFetch(2000, mockFetch)
    const response = await fetch('https://example.com')
    expect(response.body).toBeTruthy()
  })

  it('throws an error on a timeout', async () => {
    const mockFetch = jest.fn(
      (..._) => new Promise<Response>(
        (resolver) =>
          setTimeout(() => resolver(new Response('body')),
          1000
        )
      )
    )

    const fetch = timedFetch(10, mockFetch)
    expect(
      fetch('https://example.com')
    ).rejects.toBeInstanceOf(TimeoutError)
  })
})
