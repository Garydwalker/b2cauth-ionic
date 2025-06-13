// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Gwmsauthplugin",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "Gwmsauthplugin",
            targets: ["msauthpluginPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "msauthpluginPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/msauthpluginPlugin"),
        .testTarget(
            name: "msauthpluginPluginTests",
            dependencies: ["msauthpluginPlugin"],
            path: "ios/Tests/msauthpluginPluginTests")
    ]
)