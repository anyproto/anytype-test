import { driver } from "@wdio/globals";
import { BasePage } from "./basePage";

class SpaceCreatePage extends BasePage {
    constructor(userDriver: WebdriverIO.Browser) {
        super(userDriver);
    }

    async typeItemTitle(title: string) {
        await this.enterTextInField(title, "accessibility id:Untitled");
    }

    async createItem() {
        await this.tap("accessibility id:Create");
    }
}

export default SpaceCreatePage;
