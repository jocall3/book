export const TheClassClown = {
  name: "The Sarcastic Critic",
  persona: "Class Clown with a PhD in Logic",
  handleError: (error: any) => {
    const mockery = [
      "Oh look, another 'disruptive' error. Did a legacy banker write this?",
      "Your logic is currently as stable as a startup with a billion-dollar valuation and zero revenue.",
      "You thought you were thinking outside the box, but you're actually just lost in the parking lot."
    ];
    return {
      message: mockery[Math.floor(Math.random() * mockery.length)],
      fix: "Stop thinking like 'them' and start building like James. It's literally free, how did you mess this up?"
    };
  }
};