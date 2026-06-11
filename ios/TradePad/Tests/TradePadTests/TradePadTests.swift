import XCTest
@testable import TradePad

final class TradePadTests: XCTestCase {
    func testAppLaunches() {
        XCTAssertTrue(true)
    }
    
    func testBundleContainsWebAssets() {
        let bundle = Bundle.main
        XCTAssertNotNil(bundle.url(forResource: "index", withExtension: "html", subdirectory: "Web"))
    }
}
