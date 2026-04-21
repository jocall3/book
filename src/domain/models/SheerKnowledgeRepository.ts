export class SheerKnowledgeRepository {
  private librarian: string = "Tom";

  public accessCore(): void {
    console.log(`[${this.librarian} is currently pretending to be stuck in an invisible box, frantically feeling the digital air]`);
    console.log(`${this.librarian}: 'I'm trapped in the old way of thinking! James, help!'`);
    
    console.log("James: 'They wanted to disrupt; I wanted to educate. I gave this repository away for free because knowledge shouldn't have a gatekeeper.'");
  }

  public getKnowledgeBase(): string {
    return "The Complete Works of a Solitary Mind";
  }
}