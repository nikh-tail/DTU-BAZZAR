import 'package:flutter/material.dart';
import '../data/models/listing_model.dart';
import '../data/repositories/listing_repository.dart';

class ListingProvider extends ChangeNotifier {
  final ListingRepository _listingRepo;

  List<ListingModel> _listings = [];
  List<ListingModel> _trendingListings = [];
  List<ListingModel> _myActiveListings = [];
  List<ListingModel> _mySoldListings = [];
  List<ListingModel> _mySavedListings = [];

  bool _isLoading = false;
  String _selectedCategory = 'ALL';
  String _searchQuery = '';
  String _selectedCondition = '';

  List<ListingModel> get listings => _listings;
  List<ListingModel> get trendingListings => _trendingListings;
  List<ListingModel> get myActiveListings => _myActiveListings;
  List<ListingModel> get mySoldListings => _mySoldListings;
  List<ListingModel> get mySavedListings => _mySavedListings;

  bool get isLoading => _isLoading;
  String get selectedCategory => _selectedCategory;
  String get searchQuery => _searchQuery;
  String get selectedCondition => _selectedCondition;

  ListingProvider(this._listingRepo) {
    fetchInitialData();
  }

  Future<void> fetchInitialData() async {
    _isLoading = true;
    notifyListeners();

    _trendingListings = await _listingRepo.getListings(limit: 8, sortBy: 'popular');
    await fetchListings();

    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchListings() async {
    _isLoading = true;
    notifyListeners();

    _listings = await _listingRepo.getListings(
      search: _searchQuery,
      category: _selectedCategory,
      condition: _selectedCondition,
      sortBy: 'newest',
    );

    _isLoading = false;
    notifyListeners();
  }

  void setCategory(String categoryId) {
    _selectedCategory = categoryId;
    fetchListings();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    fetchListings();
  }

  void setCondition(String condition) {
    _selectedCondition = condition;
    fetchListings();
  }

  void resetFilters() {
    _selectedCategory = 'ALL';
    _searchQuery = '';
    _selectedCondition = '';
    fetchListings();
  }

  Future<void> toggleSave(String listingId) async {
    final success = await _listingRepo.toggleSaveListing(listingId);
    if (success) {
      _listings = _listings.map((item) {
        if (item.id == listingId) {
          return item.copyWith(isSaved: !item.isSaved);
        }
        return item;
      }).toList();

      _trendingListings = _trendingListings.map((item) {
        if (item.id == listingId) {
          return item.copyWith(isSaved: !item.isSaved);
        }
        return item;
      }).toList();

      notifyListeners();
      fetchMySavedListings();
    }
  }

  Future<void> fetchMyListings() async {
    _myActiveListings = await _listingRepo.getMyActiveListings();
    _mySoldListings = await _listingRepo.getMySoldListings();
    _mySavedListings = await _listingRepo.getMySavedListings();
    notifyListeners();
  }

  Future<void> fetchMySavedListings() async {
    _mySavedListings = await _listingRepo.getMySavedListings();
    notifyListeners();
  }

  Future<bool> markSold(String listingId) async {
    final success = await _listingRepo.markAsSold(listingId);
    if (success) {
      await fetchMyListings();
      await fetchListings();
    }
    return success;
  }

  Future<bool> deleteListing(String listingId) async {
    final success = await _listingRepo.deleteListing(listingId);
    if (success) {
      await fetchMyListings();
      await fetchListings();
    }
    return success;
  }
}
