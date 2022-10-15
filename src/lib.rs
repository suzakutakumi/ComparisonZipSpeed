mod utils;

use std::io::prelude::*;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen]
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm-zip!");
}

#[wasm_bindgen(catch)]
pub fn zip_file(file_name: &str, bytes: &[u8]) -> Result<Vec<u8>, String> {
    let mut zip = zip::ZipWriter::new(std::io::Cursor::new(vec![]));

    let options =
        zip::write::FileOptions::default().compression_method(zip::CompressionMethod::DEFLATE);
    zip.start_file(file_name, options)
        .map_err(|e| e.to_string())?;
    zip.write_all(bytes).map_err(|e| e.to_string())?;

    let vec = zip.finish().map_err(|e| e.to_string())?;

    Ok(vec.into_inner().to_owned())
}
