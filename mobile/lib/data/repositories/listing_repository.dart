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
      if (category != null && category != 'ALL') params['category'] = category;
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

  Future<bool> createListing(Map<String, dynamic> data) async {
    try {
      final res = await _client.post(ApiEndpoints.listings, data: data);
      return res.data['success'] == true;
    } catch (e) {
      print('Create Listing Error: $e');
      return false;
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
