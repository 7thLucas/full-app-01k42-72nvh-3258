import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

interface BiodataForm {
  namaLengkap: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  pekerjaan: string;
  statusPerkawinan: string;
}

interface FormErrors {
  [key: string]: string;
}

function BiodataKeluarga() {
  const [formData, setFormData] = useState<BiodataForm>({
    namaLengkap: '',
    nik: '',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    pekerjaan: '',
    statusPerkawinan: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [savedData, setSavedData] = useState<BiodataForm[]>([]);

  const statusOptions = [
    'Belum Kawin',
    'Kawin',
    'Cerai Hidup',
    'Cerai Mati'
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.namaLengkap.trim()) {
      newErrors.namaLengkap = 'Nama lengkap wajib diisi';
    }

    if (!formData.nik.trim()) {
      newErrors.nik = 'NIK wajib diisi';
    } else if (!/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = 'NIK harus terdiri dari 16 digit angka';
    }

    if (!formData.tempatLahir.trim()) {
      newErrors.tempatLahir = 'Tempat lahir wajib diisi';
    }

    if (!formData.tanggalLahir) {
      newErrors.tanggalLahir = 'Tanggal lahir wajib diisi';
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat wajib diisi';
    }

    if (!formData.pekerjaan.trim()) {
      newErrors.pekerjaan = 'Pekerjaan wajib diisi';
    }

    if (!formData.statusPerkawinan) {
      newErrors.statusPerkawinan = 'Status perkawinan wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to local state (in real app, this would be API call)
      setSavedData(prev => [...prev, { ...formData }]);
      setIsSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          namaLengkap: '',
          nik: '',
          tempatLahir: '',
          tanggalLahir: '',
          alamat: '',
          pekerjaan: '',
          statusPerkawinan: ''
        });
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      setErrors({ submit: 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with Indonesian family image */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">📋 Biodata Keluarga</h1>
              <p className="text-blue-100">Sistem Pencatatan Data Keluarga Desa</p>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1511895426328-dc8714aecd14?w=200&h=120&fit=crop&crop=faces" 
                alt="Keluarga Indonesia" 
                className="rounded-lg shadow-lg w-48 h-28 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Form Biodata Keluarga</h2>
                    <p className="text-gray-600">Silakan lengkapi data anggota keluarga dengan benar</p>
                  </div>
                </div>

                {isSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-green-800 font-medium">✅ Data berhasil disimpan!</p>
                    </div>
                  </div>
                )}

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-800">{errors.submit}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👤 Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.namaLengkap ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Masukkan nama lengkap sesuai KTP"
                    />
                    {errors.namaLengkap && (
                      <p className="text-red-600 text-sm mt-1">{errors.namaLengkap}</p>
                    )}
                  </div>

                  {/* NIK */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🆔 Nomor Induk Kependudukan (NIK) *
                    </label>
                    <input
                      type="text"
                      name="nik"
                      value={formData.nik}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.nik ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="16 digit nomor NIK"
                      maxLength={16}
                    />
                    {errors.nik && (
                      <p className="text-red-600 text-sm mt-1">{errors.nik}</p>
                    )}
                  </div>

                  {/* Tempat & Tanggal Lahir */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📍 Tempat Lahir *
                      </label>
                      <input
                        type="text"
                        name="tempatLahir"
                        value={formData.tempatLahir}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.tempatLahir ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Contoh: Jakarta"
                      />
                      {errors.tempatLahir && (
                        <p className="text-red-600 text-sm mt-1">{errors.tempatLahir}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📅 Tanggal Lahir *
                      </label>
                      <input
                        type="date"
                        name="tanggalLahir"
                        value={formData.tanggalLahir}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.tanggalLahir ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.tanggalLahir && (
                        <p className="text-red-600 text-sm mt-1">{errors.tanggalLahir}</p>
                      )}
                    </div>
                  </div>

                  {/* Alamat */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏠 Alamat Lengkap *
                    </label>
                    <textarea
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.alamat ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kab/Kota, Provinsi"
                    />
                    {errors.alamat && (
                      <p className="text-red-600 text-sm mt-1">{errors.alamat}</p>
                    )}
                  </div>

                  {/* Pekerjaan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💼 Pekerjaan *
                    </label>
                    <input
                      type="text"
                      name="pekerjaan"
                      value={formData.pekerjaan}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.pekerjaan ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Contoh: PNS, Wiraswasta, Petani, Ibu Rumah Tangga"
                    />
                    {errors.pekerjaan && (
                      <p className="text-red-600 text-sm mt-1">{errors.pekerjaan}</p>
                    )}
                  </div>

                  {/* Status Perkawinan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💑 Status Perkawinan *
                    </label>
                    <select
                      name="statusPerkawinan"
                      value={formData.statusPerkawinan}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.statusPerkawinan ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Pilih status perkawinan</option>
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    {errors.statusPerkawinan && (
                      <p className="text-red-600 text-sm mt-1">{errors.statusPerkawinan}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                        isLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50'
                      } text-white`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Menyimpan Data...
                        </div>
                      ) : (
                        '💾 Simpan Biodata'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Info Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Informasi Penting</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <p className="text-sm text-gray-600">Pastikan data yang diisi sesuai dengan dokumen resmi</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <p className="text-sm text-gray-600">NIK harus terdiri dari 16 digit angka</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <p className="text-sm text-gray-600">Semua field bertanda (*) wajib diisi</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <p className="text-sm text-gray-600">Data akan tersimpan dengan aman</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Statistik Data</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Data Tersimpan:</span>
                    <span className="font-bold text-green-600">{savedData.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Data Hari Ini:</span>
                    <span className="font-bold text-green-600">{savedData.length}</span>
                  </div>
                </div>
              </div>

              {/* Village Image */}
              <div className="mt-6">
                <img 
                  src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=200&fit=crop" 
                  alt="Desa Indonesia" 
                  className="w-full h-48 object-cover rounded-xl shadow-lg"
                />
                <p className="text-center text-sm text-gray-600 mt-2">🏘️ Sistem Desa Digital Indonesia</p>
              </div>
            </div>
          </div>

          {/* Recent Data Display */}
          {savedData.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📝 Data Tersimpan Terakhir</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pekerjaan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {savedData.slice(-3).map((data, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.namaLengkap}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.nik}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.pekerjaan}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {data.statusPerkawinan}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BiodataKeluarga />} />
    </Routes>
  );
}
