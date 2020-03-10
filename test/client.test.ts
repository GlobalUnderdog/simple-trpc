jest.mock('../src/client') // this happens automatically with automocking
import { rawFetch } from '../src/client'
const { timedFetch, TimeoutError } = jest.requireActual('../src/client')

import { mocked } from "ts-jest/utils"

describe('timedFetch', () => {
  it('succeds on a prompt response', async () => {
    mocked(rawFetch).mockImplementation(
      (..._) => new Promise<Response>(
        (resolver) =>
          setTimeout(() => resolver(new Response('body')),
        )
      )
    )

    const fetch = timedFetch(2000)
    const response = await fetch('https://example.com')
    expect(response.body).toBeTruthy()
  })

  it('throws an error on a timeout', async () => {
    mocked(rawFetch).mockImplementation(
      (..._) => new Promise<Response>(
        (resolver) =>
          setTimeout(() => resolver(new Response('body')),
          1000
        )
      )
    )

    const fetch = timedFetch(10)
    expect(
      fetch('https://example.com')
    ).rejects.toBeInstanceOf(TimeoutError)
  })
})