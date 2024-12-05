// Simple storage to share data between simulator instances
class LinkStorage {
  private static inviteLink: string | null = null;

  static setInviteLink(link: string) {
    this.inviteLink = link;
  }

  static getInviteLink(): string | null {
    return this.inviteLink;
  }

  static clearInviteLink() {
    this.inviteLink = null;
  }
}

export default LinkStorage;
