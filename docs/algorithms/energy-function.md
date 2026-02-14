# Energy Function

**File:** `src/logic/generation/scorer.ts`

## What is it?

The energy function scores how "unfair" a board layout is. **Lower energy = fairer board.** It's used by the simulated annealing algorithm to evaluate each candidate layout.

## Formula

```
Energy = (Same Resource Adjacencies × 100)
       + (High Number Adjacencies × 150)
       + (Pip Variance × 10)
```

## Components

### 1. Same Resource Adjacency Penalty

Two hexes of the same resource should not be adjacent. This prevents clusters like "4 wheat tiles in a corner".

```
  ┌────┐  ┌────┐          ┌────┐  ┌────┐
  │Wood│──│Wood│  BAD      │Wood│──│Ore │  GOOD
  └────┘  └────┘          └────┘  └────┘
     +100 penalty            +0 penalty
```

**Weight: 100 per pair**

Each pair of adjacent hexes with the same non-desert resource adds 100 to the energy.

### 2. High Number (6/8) Adjacency Penalty

Numbers 6 and 8 are the most valuable (5 pips each, highest probability after 7). If they're adjacent, the player who settles at that intersection gets a massive advantage.

```
  ┌──────┐  ┌──────┐          ┌──────┐  ┌──────┐
  │  6   │──│  8   │  BAD     │  6   │──│  4   │  GOOD
  │(5pip)│  │(5pip)│          │(5pip)│  │(3pip)│
  └──────┘  └──────┘          └──────┘  └──────┘
     +150 penalty                +0 penalty
```

**Weight: 150 per pair** (highest penalty — this is the most impactful imbalance)

### 3. Pip Variance by Region

The board is divided into 3 regions. Each region should have a similar total pip count, so no area of the board is dramatically more productive than another.

```
          ╭───╮
        ╱ CORNER╲
      ╭───╮───╭───╮
    ╱ EDGE ╲╱ EDGE ╲
  ╭───╮───╭───╮───╭───╮
╱ CORNER╲╱CENTER╲╱CORNER╲
  ╰───╯───╰───╯───╰───╯
    ╲ EDGE ╱╲ EDGE ╱
      ╰───╯───╰───╯
        ╲ CORNER╱
          ╰───╯
```

| Region | Hex Indices | Description |
|--------|-------------|-------------|
| Corners | 0, 2, 7, 11, 16, 18 | The 6 outermost corner hexes |
| Center | 9 | The center hex |
| Edges | Remaining 12 | All other hexes |

**Calculation:**
1. Sum pips per region
2. Calculate variance: `Σ(regionPips - mean)² / n`
3. Multiply by weight 10

A board where corners have 30 total pips and edges have 10 would score high (bad). A board where both have ~20 scores low (good).

## Pip Reference

Each number token has a pip count representing its probability of being rolled:

| Number | 2 | 3 | 4 | 5 | 6 | 8 | 9 | 10 | 11 | 12 |
|--------|---|---|---|---|---|---|---|----|----|-----|
| Pips   | 1 | 2 | 3 | 4 | 5 | 5 | 4 | 3  | 2  | 1  |

```
Probability
  6/36 │          ╭─╮
  5/36 │        ╭─┤ ├─╮
  4/36 │      ╭─┤ │ │ ├─╮
  3/36 │    ╭─┤ │ │ │ │ ├─╮
  2/36 │  ╭─┤ │ │ │ │ │ │ ├─╮
  1/36 │╭─┤ │ │ │ │ │ │ │ │ ├─╮
       └──┴─┴─┴─┴─┴─┴─┴─┴─┴─┴──
        2  3  4  5  6  7  8  9 10 11 12
                    ↑
              (7 = most common, no token)
```

## Example

A board with:
- 2 same-resource adjacencies → 200
- 1 pair of adjacent 6/8 → 150
- Pip variance of 5.0 → 50

**Total energy: 400**

After optimization, a good board typically reaches energy **0–50**.
