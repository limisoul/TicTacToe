// noinspection JSUnusedGlobalSymbols

/**
 * 并查集(Disjoint Set Union, DSU)
 */
class UnionFind {
  constructor(size) {
    this.root = new Array(size).fill(0).map((value, index) => index)
    this.rank = new Array(size).fill(0)
  }

  find(x) {
    if (x === this.root[x]) {
      return x
    }
    return this.root[x] = this.find(this.root[x])
  }

  union(x, y) {
    const rootX = this.find(x)
    const rootY = this.find(y)

    if (rootX !== rootY) {
      if (this.rank[rootX] > this.rank[rootY]) {
        this.root[rootY] = rootX
      } else if (this.rank[rootX] < this.rank[rootY]) {
        this.root[rootX] = rootY
      } else {
        this.root[rootY] = rootX
        this.rank[rootX] += 1
      }
    }
  }

  connected(x, y) {
    return this.find(x) === this.find(y)
  }
}
