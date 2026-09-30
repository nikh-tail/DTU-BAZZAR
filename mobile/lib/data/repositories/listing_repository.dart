import 'package:dio/dio.dart';
import '../../core/constants/api_endpoints.dart';
import '../../core/network/api_client.dart';
import '../models/listing_model.dart';

class ListingRepository {
  final ApiClient _client;

  ListingRepository(this._client);

  Future<List<ListingModel>> getListings({
    String? search,
    String? category,
    String? condition,
    String? campusLocation,
    int? limit,
    String? sortBy,
  }) async {
    try {
      final Map<String, dynamic> params = {};
      if (search != null && search.isNotEmpty) params['search'] = search;
      if (category != null && category != 'ALL') {
        params['category'] = mapCategoryToBackend(category);
      }
      if (condition != null && condition.isNotEmpty) params['condition'] = condition;
      if (campusLocation != null && campusLocation != 'ALL') {
        params['campusLocation'] = campusLocation;
      }
      if (limit != null) params['limit'] = limit;
      if (sortBy != null) params['sortBy'] = sortBy;

      final res = await _client.get(ApiEndpoints.listings, queryParameters: params);
      if (res.data['success'] == true) {
        final list = res.data['data'] as List;
        return list.map((json) => ListingModel.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print('Get Listings Error: $e');
      return [];
    }
  }

  Future<ListingModel?> getListingById(String id) async {
    try {
      final res = await _client.get('${ApiEndpoints.listings}/$id');
      if (res.data['success'] == true) {
        return ListingModel.fromJson(res.data['data']);
      }
      return null;
    } catch (e) {
      print('Get Listing Detail Error: $e');
      return null;
    }
  }

  static String mapCategoryToBackend(String category) {
    switch (category) {
      case 'DRAWING_TOOLS':
        return 'LAB_STATIONERY';
      case 'ELECTRONICS':
        return 'ELECTRONICS';
      case 'BOOKS_NOTES':
        return 'BOOKS_ACADEMICS';
      case 'FASHION':
        return 'OTHER';
      case 'HOSTEL_REQ':
        return 'HOSTEL_ESSENTIALS';
      case 'HOBBY_SPORT':
        return 'SPORTS_FITNESS';
      case 'CYCLES':
        return 'CYCLES';
      case 'BOOKS_ACADEMICS':
        return 'BOOKS_ACADEMICS';
      case 'HOSTEL_ESSENTIALS':
        return 'HOSTEL_ESSENTIALS';
      case 'LAB_STATIONERY':
        return 'LAB_STATIONERY';
      case 'SPORTS_FITNESS':
        return 'SPORTS_FITNESS';
      default:
        return 'OTHER';
    }
  }

  Future<({bool success, String message})> createListing(
    Map<String, dynamic> data, {
    List<dynamic>? imageFiles,
  }) async {
    try {
      final payload = Map<String, dynamic>.from(data);
      if (payload['category'] != null) {
        payload['category'] = mapCategoryToBackend(payload['category'].toString());
      }

      dynamic body;
      if (imageFiles != null && imageFiles.isNotEmpty) {
        final formData = FormData();
        payload.forEach((key, value) {
          if (value is List) {
            for (var item in value) {
              formData.fields.add(MapEntry('$key[]', item.toString()));
            }
          } else {
            formData.fields.add(MapEntry(key, value.toString()));
          }
        });

        for (final img in imageFiles) {
          final path = img.path?.toString() ?? '';
          if (path.isNotEmpty) {
            final fileName = (img.name != null && img.name.toString().isNotEmpty)
                ? img.name.toString()
                : 'listing_${DateTime.now().millisecondsSinceEpoch}.jpg';
            formData.files.add(MapEntry(
              'images',
              await MultipartFile.fromFile(path, filename: fileName),
            ));
          }
        }
        body = formData;
      } else {
        body = payload;
      }

      final res = await _client.post(ApiEndpoints.listings, data: body);
      if (res.data != null && res.data['success'] == true) {
        return (
          success: true,
          message: res.data['message']?.toString() ?? 'Listing posted successfully!',
        );
      }
      return (
        success: false,
        message: res.data?['message']?.toString() ?? 'Failed to publish listing.',
      );
    } catch (e) {
      print('Create Listing Error: $e');
      String msg = 'Failed to publish listing. Please check connection.';
      try {
        final dynamic err = e;
        if (err.response?.data != null && err.response.data['message'] != null) {
          msg = err.response.data['message'].toString();
        }
      } catch (_) {}
      return (success: false, message: msg);
    }
  }

  Future<bool> toggleSaveListing(String listingId) async {
    try {
      final res = await _client.post(
        '${ApiEndpoints.listings}/$listingId/save',
      );
      return res.data['success'] == true;
    } catch (e) {
      print('Toggle Save Error: $e');
      return false;
    }
  }

  Future<List<ListingModel>> getMyActiveListings() async {
    try {
      final res = await _client.get(ApiEndpoints.myActiveListings);
      if (res.data['success'] == true) {
        final list = res.data['data'] as List;
        return list.map((json) => ListingModel.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print('Get Active Listings Error: $e');
      return [];
    }
  }

  Future<List<ListingModel>> getMySoldListings() async {
    try {
      final res = await _client.get(ApiEndpoints.mySoldListings);
      if (res.data['success'] == true) {
        final list = res.data['data'] as List;
        return list.map((json) => ListingModel.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print('Get Sold Listings Error: $e');
      return [];
    }
  }

  Future<List<ListingModel>> getMySavedListings() async {
    try {
      final res = await _client.get(ApiEndpoints.mySavedListings);
      if (res.data['success'] == true) {
        final list = res.data['data'] as List;
        return list.map((json) => ListingModel.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print('Get Saved Listings Error: $e');
      return [];
    }
  }

  Future<bool> markAsSold(String listingId) async {
    try {
      final res = await _client.put('${ApiEndpoints.listings}/$listingId/sold');
      return res.data['success'] == true;
    } catch (e) {
      print('Mark Sold Error: $e');
      return false;
    }
  }

  Future<bool> deleteListing(String listingId) async {
    try {
      final res = await _client.delete('${ApiEndpoints.listings}/$listingId');
      return res.data['success'] == true;
    } catch (e) {
      print('Delete Listing Error: $e');
      return false;
    }
  }
}
