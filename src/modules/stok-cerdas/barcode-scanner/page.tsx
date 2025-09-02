import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Flashlight, FlashlightOff, RotateCcw } from 'lucide-react';
import { isValidBarcode } from '../utils';
import type { Ingredient } from '../types';

// Mock data for demo
const mockIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Daging Sapi',
    category: { id: 'protein', name: 'Protein', color: 'bg-red-100 text-red-800', icon: '🥩' },
    currentStock: 5,
    unit: 'kg',
    minimumThreshold: 10,
    maximumThreshold: 50,
    costPerUnit: 120000,
    barcode: '1234567890123',
  },
];

export default function BarcodeScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [foundIngredient, setFoundIngredient] = useState<Ingredient | null>(null);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup camera stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScanning(true);
      }
    } catch (err) {
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.');
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const handleManualInput = (value: string) => {
    setManualInput(value);
    if (value && isValidBarcode(value)) {
      handleBarcodeFound(value);
    }
  };

  const handleBarcodeFound = (barcode: string) => {
    setScannedResult(barcode);
    
    // Look for ingredient with matching barcode
    const ingredient = mockIngredients.find(ing => ing.barcode === barcode);
    
    if (ingredient) {
      setFoundIngredient(ingredient);
    } else {
      setFoundIngredient(null);
    }
    
    stopScanning();
  };

  const resetScanner = () => {
    setScannedResult(null);
    setFoundIngredient(null);
    setManualInput('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Scan Barcode</h1>
            </div>
            {scanning && (
              <button
                onClick={() => setFlashEnabled(!flashEnabled)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                {flashEnabled ? <Flashlight className="w-6 h-6" /> : <FlashlightOff className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!scannedResult ? (
          <div className="space-y-6">
            {/* Camera View */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative aspect-square bg-black">
                {scanning ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Scan overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-2 border-white w-64 h-64 rounded-lg">
                        <div className="w-full h-full border-2 border-primary-500 border-dashed rounded-lg animate-pulse"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <button
                        onClick={stopScanning}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
                      >
                        Stop Scanning
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white">
                      <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-semibold mb-2">Siap untuk Scan</p>
                      <p className="text-gray-400 mb-6">Arahkan kamera ke barcode bahan</p>
                      <button
                        onClick={startScanning}
                        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"
                      >
                        Mulai Scan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Manual Input */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Input Manual</h3>
              <p className="text-gray-600 mb-4">
                Atau masukkan kode barcode secara manual jika scan tidak berhasil
              </p>
              <input
                type="text"
                placeholder="Masukkan kode barcode..."
                value={manualInput}
                onChange={(e) => handleManualInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
              />
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips Scanning</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Pastikan barcode dalam kondisi bersih dan tidak rusak</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Arahkan kamera dengan jarak yang cukup dekat</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Pastikan pencahayaan cukup terang</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Tahan kamera dengan stabil saat scanning</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          /* Scan Result */
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Scan Berhasil!</h3>
                <p className="text-gray-600">Barcode: <span className="font-mono">{scannedResult}</span></p>
              </div>

              {foundIngredient ? (
                <div className="border border-green-200 rounded-lg p-4 bg-green-50 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                      {foundIngredient.category.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{foundIngredient.name}</h4>
                      <p className="text-sm text-gray-600">
                        Stok: {foundIngredient.currentStock} {foundIngredient.unit}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${foundIngredient.category.color}`}>
                        {foundIngredient.category.name}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50 mb-6">
                  <p className="text-yellow-800 text-center">
                    Bahan dengan barcode ini tidak ditemukan di database
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={resetScanner}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Scan Lagi</span>
                </button>
                
                {foundIngredient && (
                  <button className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Lihat Detail
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
