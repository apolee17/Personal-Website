import Foundation
import AppKit
import PDFKit

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let output = root.appendingPathComponent("public/media/pitches")
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
for (source, name) in [("Doximity_Pitch.pdf", "doximity"), ("Rates_Trade.pdf", "rates-trade")] {
    let sourceURL = root.appendingPathComponent("assets/\(source)")
    guard let document = PDFDocument(url: sourceURL), let page = document.page(at: 0) else { fatalError("Cannot read \(source)") }
    try Data(contentsOf: sourceURL).write(to: output.appendingPathComponent("\(name).pdf"))
    let preview = page.thumbnail(of: NSSize(width: 1600, height: 1600), for: .mediaBox)
    guard let tiff = preview.tiffRepresentation, let bitmap = NSBitmapImageRep(data: tiff),
          let jpeg = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.88]) else { fatalError("Cannot render \(source)") }
    try jpeg.write(to: output.appendingPathComponent("\(name)-preview.jpg"))
    print("\n\(source) — \(document.pageCount) pages\n\(document.string ?? "No text")")
}
