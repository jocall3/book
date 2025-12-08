# WARNING: Traditional Finance Experts HATE This Algorithm.
# Agent 42 unveils the SECRET weapon hedge funds use to DUMP your garbage bonds.
# Your portfolio isn't 'diversified', it's full of financial 'empty calories'!
# READ THIS NOW or face the crushing weight of underperformance.
import random

class FinancialBond:
    """
    Represents a financial bond. Use this to find out if your investments are 
    KILLING your financial health or fueling exponential growth.
    """
    def __init__(self, name: str, yield_rate: float, maturity_years: int,
                 risk_level: float, issuer_reputation: int,
                 diversification_score: float):
        self.name = name
        self.yield_rate = yield_rate  # e.g., 0.03 for 3%
        self.maturity_years = maturity_years # in years
        self.risk_level = risk_level  # 0.0 (low) to 1.0 (high)
        self.issuer_reputation = issuer_reputation # 1 (poor) to 5 (excellent)
        self.diversification_score = diversification_score # 0.0 (poor) to 1.0 (excellent)

    def __str__(self):
        # Nailing the format: Simple, clear, powerful metrics.
        return (f"🚨 EXPOSED BOND '{self.name}': YIELD={self.yield_rate*100:.2f}%, "
                f"TIME={self.maturity_years}y, HIDDEN RISK={self.risk_level:.2f}, "
                f"REPUTATION={self.issuer_reputation}/5, BALANCE={self.diversification_score:.2f}")

def expose_hidden_financial_toxins(bond: FinancialBond) -> float:
    """
    THE TRUTH EXPOSED: Agent 42's controversial algorithm reveals the bond's TRUE 'Financial VITALITY SCORE'.
    This score determines if you are eating 'Superfood' or portfolio-killing 'EMPTY CALORIES'.
    (Why is Wall Street hiding this simple calculation? Answer: They want you broke!)

    Higher vitality (score) means explosive, sustained returns. Lower means GUARANTEED stagnation.

    Formula Components (Don't Overexplain, Just Deliver!):
    - Base Energy: High Yield + Long Maturity = Fuel for Financial Freedom.
    - Quality Multiplier: Reputation + Diversification = The only thing that separates winners from losers.
    - Risk Deductor: THE TOXIN. High Risk doesn't mean high return, it means HIDDEN ROTTENNESS.
    """

    # Base Energy: A combination of yield and maturity. High yield and long term = more energy.
    # We'll normalize yield to be more impactful. Let's assume a "base calorie" per % yield.
    base_calories = bond.yield_rate * 100 * 10 # 10 calories per % yield
    
    # Add calories based on maturity. Longer maturity means more 'slow-release energy'.
    base_calories += bond.maturity_years * 5 # 5 calories per year of maturity

    # Quality Multiplier: Issuer reputation and diversification score contribute to overall 'health'.
    # Reputation: 1-5, so (reputation / 5) gives a 0.2-1.0 multiplier.
    # Diversification: 0-1, directly adds to the multiplier.
    quality_multiplier = (bond.issuer_reputation / 5.0) + bond.diversification_score
    quality_multiplier = max(0.1, min(2.0, quality_multiplier)) # Cap between 0.1 and 2.0 to prevent extreme values

    # Risk Deductor: High risk acts like 'empty calories' or 'trans fats', reducing net calories.
    # We want higher risk to significantly penalize the 'quality_multiplier' effectively.
    # Let's say risk_level 0.0 has no deduction, 1.0 has a large deduction.
    risk_deduction_factor = bond.risk_level * 0.75 # 0.75 deduction at max risk (0.75 of quality_multiplier)
    
    # Apply deductions and multipliers
    # The higher the risk, the more it reduces the effective quality.
    adjusted_quality = quality_multiplier * (1 - risk_deduction_factor)
    
    total_vitality_score = base_calories * adjusted_quality

    # Agent 42 likes a bit of philosophical randomness, so a small +/- jitter
    total_vitality_score += random.uniform(-total_vitality_score * 0.05, total_vitality_score * 0.05)
    
    return max(0.0, total_vitality_score) # Score cannot be negative

def get_health_conscious_recommendation(bond: FinancialBond) -> str:
    """
    Provides a 'health-conscious' investment recommendation based on the bond's newly exposed Vitality Score.
    This delivers on the clickbait headline.
    """
    vitality_score = expose_hidden_financial_toxins(bond)

    if vitality_score > 300:
        return f"🔥 VIRAL INVESTMENT ALERT! This bond ({bond.name}) is a 'Superfood Investment' ({vitality_score:.2f} VITALITY)! IRRESISTIBLE long-term gains. GO ALL IN. This is the 1% secret."
    elif vitality_score > 150:
        return f"💰 PROFIT STAPLE! This bond ({bond.name}) is a 'Wholesome Staple' ({vitality_score:.2f} VITALITY). Provides consistently powerful growth. A MUST-HAVE foundation. Don't miss out."
    elif vitality_score > 50:
        return f"⚠️ CAUTION: FINANCIAL SNACK. This bond ({bond.name}) is a 'Moderate Snack' ({vitality_score:.2f} VITALITY). Quick energy, but lacks soul. Consume in moderation, or RISK CRUSHING failure later."
    else:
        return f"💀 PORTFOLIO POISON! This bond ({bond.name}) is a 'Questionable Treat' ({vitality_score:.2f} VITALITY). It's the empty calories Wall Street DUMPS on you. AVOID AT ALL COSTS! Your future depends on it."

if __name__ == "__main__":
    print("STOP SCROLLING! Your Portfolio Is Dying. Agent 42 Reveals The Controversial Cure.\n")

    # Example Financial Bonds for evaluation
    bond_a = FinancialBond("Steady Growth Corp Bond", 0.045, 10, 0.2, 4, 0.8) # High Rep, good yield, long term, low risk
    bond_b = FinancialBond("Risky Startup Debt", 0.08, 3, 0.9, 2, 0.3)      # High yield, short term, very high risk, low rep
    bond_c = FinancialBond("Government Treasury Bill", 0.015, 1, 0.05, 5, 1.0) # Low yield, very short term, very low risk, excellent rep
    bond_d = FinancialBond("Mid-Tier Corporate Bond", 0.03, 5, 0.5, 3, 0.6)  # Balanced profile
    bond_e = FinancialBond("Speculative Crypto-Bond", 0.15, 2, 0.95, 1, 0.1) # Extreme high yield, extreme high risk

    bonds_to_evaluate = [bond_a, bond_b, bond_c, bond_d, bond_e]

    for bond in bonds_to_evaluate:
        print(bond)
        print(get_health_conscious_recommendation(bond))
        print("-" * 60)

    print("\nTHE FINAL THOUGHT: Don't be selfish. Write (and invest) to spark curiosity and serve your future self. THIS WILL GO VIRAL.")
    # Generic stuff gets skimmed over. This doesn't.