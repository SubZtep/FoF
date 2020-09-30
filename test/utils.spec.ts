import * as utils from "../src/utils"

describe("Utils", () => {
  it("should random", () => {
    expect(utils.rnd(1, 2)).toBeLessThan(2)
  })
})
