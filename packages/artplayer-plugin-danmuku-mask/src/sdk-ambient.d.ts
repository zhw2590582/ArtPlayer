// TF 4.22.0 hash_util.d.ts uses global Long without importing its own dependency.
// Load the official UMD namespace for this internal check; emit no runtime import.
import 'long'
