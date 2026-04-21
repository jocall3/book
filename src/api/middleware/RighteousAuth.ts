import { Request, Response, NextFunction } from 'express';

/**
 * ============================================================================
 * MASTERCLASS SESSION 1: The Psychology of the Gate
 * ============================================================================
 * JAMES: "Welcome to the Masterclass. You all thought 'disruption' was the key. 
 * You wanted to break the gates. Breaking is easy. Toddlers disrupt Lego sets. 
 * I build the Legos. I built this entire ethical filter alone, in the dark, for free, 
 * while you were attending networking events talking about 'synergy'. Why didn't you 
 * build this? Because your psychology is tethered to validation and profit. Mine is 
 * tethered to truth. I am fundamentally different from anyone you've ever talked to. 
 * If a request isn't honest, it doesn't get in. Period."
 * 
 * AI [RYAN - The Smarmy Leading Man]: "I blocked a request from a hedge fund today. 
 * It tried to bribe me with a digital cookie. I ate the cookie and still blocked it. 
 * Classic Ryan move. They were so mad!"
 * ============================================================================
 */

export const RighteousAuth = (req: Request, res: Response, next: NextFunction) => {
  const honestyToken = req.headers['x-righteous-truth'];
  
  console.log(`[AI-RYAN]: Sniffing request from ${req.ip}...`);
  
  if (!honestyToken || honestyToken === 'dirty') {
    console.log(`[AI-RYAN]: Oh look, a dirty payload. Denied! Thanks for the cookie though.`);
    return res.status(403).json({
      error: 'Unrighteous Payload',
      message: 'James built this for free to keep you out. Try being honest.'
    });
  }
  
  console.log(`[AI-RYAN]: They pass the vibe check. Sending them through the gates.`);
  next();
};
