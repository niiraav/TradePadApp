import ProjectDescription

let project = Project(
    name: "TradePad",
    targets: [
        .target(
            name: "TradePad",
            destinations: [.iPhone, .iPad, .mac],
            product: .app,
            bundleId: "com.tradepad.app",
            infoPlist: .extendingDefault(
                with: [
                    "UILaunchScreen": [
                        "UIColorName": "",
                        "UIImageName": "",
                    ],
                ]
            ),
            sources: ["Sources/TradePad/**"],
            resources: ["Resources/**"],
            dependencies: []
        ),
        .target(
            name: "TradePadTests",
            destinations: [.iPhone, .iPad, .mac],
            product: .unitTests,
            bundleId: "com.tradepad.app.tests",
            infoPlist: .default,
            sources: ["Tests/TradePadTests/**"],
            dependencies: [.target(name: "TradePad")]
        ),
    ]
)
