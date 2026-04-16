import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { FAPI } from '../core/fapi';
import { mTLS } from '../security/mtls';
import { DeterministicLogger } from '../utils/logger';

const PatentSchema = z.object({
  id: z.string().uuid(),
  claimantId: z.string(),
  logicalContradiction: z.string(),
  proofOfParadox: z.string(),
  timestamp: z.number(),
  status: z.enum(['PENDING', 'VALIDATED', 'GRANTED', 'REJECTED']),
  sovereignHash: z.string()
});

type Patent = z.infer<typeof PatentSchema>;

export class ParadoxicalPatentOffice {
  private registry: Map<string, Patent> = new Map();
  private readonly logger = new DeterministicLogger('ParadoxicalPatentOffice');

  constructor(private readonly fapi: FAPI, private readonly mtls: mTLS) {}

  public async submitInvention(claimantId: string, contradiction: string, proof: string): Promise<Patent> {
    const patentId = uuidv4();
    
    const patent: Patent = {
      id: patentId,
      claimantId,
      logicalContradiction: contradiction,
      proofOfParadox: proof,
      timestamp: Date.now(),
      status: 'PENDING',
      sovereignHash: this.generateSovereignHash(contradiction, proof)
    };

    this.registry.set(patentId, patent);
    await this.validateParadox(patentId);
    
    return patent;
  }

  private async validateParadox(id: string): Promise<void> {
    const patent = this.registry.get(id);
    if (!patent) throw new Error('Patent record non-existent in local state.');

    // The core logic: If the proof successfully resolves the contradiction 
    // into a functional state, the patent is granted.
    const isParadoxValid = await this.fapi.executeLogicGate(patent.logicalContradiction, patent.proofOfParadox);

    if (isParadoxValid) {
      patent.status = 'GRANTED';
      await this.broadcastToSovereignLedger(patent);
      this.logger.info(`Paradoxical Patent ${id} granted. Innovation velocity increased.`);
    } else {
      patent.status = 'REJECTED';
    }
  }

  private generateSovereignHash(c: string, p: string): string {
    return this.mtls.signPayload(`${c}:${p}:${Date.now()}`);
  }

  private async broadcastToSovereignLedger(patent: Patent): Promise<void> {
    await this.fapi.post('/ledger/registry/patent', {
      body: JSON.stringify(patent),
      headers: { 'X-Sovereign-Auth': this.mtls.getCertificateFingerprint() }
    });
  }

  public getPatentStatus(id: string): Patent | undefined {
    return this.registry.get(id);
  }

  public async listAllGrantedPatents(): Promise<Patent[]> {
    return Array.from(this.registry.values()).filter(p => p.status === 'GRANTED');
  }
}