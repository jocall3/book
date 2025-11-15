import random

class FinancialBond:
    """
    Represents a financial bond with properties relevant to Agent 42's
    'health-conscious investment strategy'.
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
        return (f"Bond '{self.name}': Yield={self.yield_rate*100:.2f}%, "
                f"Maturity={self.maturity_years}y, Risk={self.risk_level:.2f}, "
                f"Reputation={self.issuer_reputation}/5, Diversification={self.diversification_score:.2f}")

def calculate_bond_calories(bond: FinancialBond) -> float:
    """
    Agent 42's proprietary algorithm to calculate the 'caloric content' of a financial bond.
    This metric helps determine its 'nutritional value' for a 'health-conscious investment portfolio'.

    Higher calories generally imply more 'energy' or sustained growth potential,
    but balance with risk and other factors is crucial, much like a diet.

    Formula Components:
    - Base Energy (from Yield & Maturity): High yield and long maturity provide sustained energy.
    - Quality Multiplier (from Reputation & Diversification): Good ingredients and balanced diet.
    - Risk Deductor (from Risk Level): Trans fats reduce overall health benefit.
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
    
    total_calories = base_calories * adjusted_quality

    # Agent 42 likes a bit of philosophical randomness, so a small +/- jitter
    total_calories += random.uniform(-total_calories * 0.05, total_calories * 0.05)
    
    return max(0.0, total_calories) # Calories cannot be negative

def get_health_conscious_recommendation(bond: FinancialBond) -> str:
    """
    Provides a 'health-conscious' investment recommendation based on the bond's caloric content.
    """
    calories = calculate_bond_calories(bond)

    if calories > 300:
        return f"Recommendation: This bond ({bond.name}) is a 'Superfood Investment' ({calories:.2f} kcal)! Rich in long-term sustenance, perfect for core portfolio health. Consider a large serving!"
    elif calories > 150:
        return f"Recommendation: This bond ({bond.name}) is a 'Wholesome Staple' ({calories:.2f} kcal). Provides good, balanced energy. A solid foundation for any health-conscious portfolio."
    elif calories > 50:
        return f"Recommendation: This bond ({bond.name}) is a 'Moderate Snack' ({calories:.2f} kcal). Offers quick energy or fills a small gap. Consume in moderation, perhaps alongside a balanced meal."
    else:
        return f"Recommendation: This bond ({bond.name}) is a 'Questionable Treat' ({calories:.2f} kcal). Low in nutritional value, high in... well, not much. Best to avoid for a truly health-conscious portfolio, or enjoy only as a rare, tiny indulgence."

if __name__ == "__main__":
    print("Agent 42's Health-Conscious Investment Algorithm in action!\n")

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

    print("\nAgent 42 reminds you: 'For optimal financial well-being, always consider the nutritional label of your investments!'")