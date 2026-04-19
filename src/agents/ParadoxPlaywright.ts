export class ParadoxPlaywright {
  public scriptLegalThriller(policyDocument: string): string {
    const scenes = policyDocument.split('.').map((line, index) => {
      return `SCENE ${index + 1}: The Boardroom. James stares at the data. "${line.trim()}"`;
    });
    return scenes.join('\n\n');
  }

  public addDramaticTension(script: string): string {
    return script.replace(/James/g, "James (with unwavering resolve)");
  }
}