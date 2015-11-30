// Generated by CoffeeScript 1.7.1
var Album, NotAllowed, NotFound, Photo, archiver, async, cozydb, downloader, fs, log, noop, sharing, slugify, _ref, _ref1;

async = require('async');

fs = require('fs');

archiver = require('archiver');

Album = require('../models/album');

Photo = require('../models/photo');

sharing = require('./sharing');

cozydb = require('cozydb');

_ref = require('../helpers/helpers'), slugify = _ref.slugify, noop = _ref.noop;

downloader = require('../helpers/downloader');

_ref1 = require('../helpers/errors'), NotFound = _ref1.NotFound, NotAllowed = _ref1.NotAllowed;

log = require('printit')({
  date: false,
  prefix: "album"
});

module.exports.index = function(req, res, next) {
  return async.parallel([
    function(cb) {
      return Album.listWithThumbs(cb);
    }, function(cb) {
      return cozydb.api.getCozyLocale(cb);
    }
  ], function(err, results) {
    var albums, locale, visible;
    if (err) {
      return next(err);
    }
    albums = results[0], locale = results[1];
    visible = [];
    return async.each(albums, function(album, callback) {
      return sharing.checkPermissions(album, req, function(err, isAllowed) {
        if (isAllowed && !err) {
          visible.push(album);
        }
        return callback(null);
      });
    }, function(err) {
      return res.render('index', {
        imports: "window.locale = \"" + locale + "\";\nwindow.initalbums = " + (JSON.stringify(visible)) + ";"
      });
    });
  });
};

module.exports.fetch = function(req, res, next, id) {
  return Album.find(id, function(err, album) {
    if (err) {
      return next(err);
    } else if (!album) {
      return next(NotFound("Album " + id));
    } else {
      req.album = album;
      return next();
    }
  });
};

module.exports.list = function(req, res, next) {
  return Album.listWithThumbs(function(err, albums) {
    var visible;
    if (err) {
      return next(err);
    }
    visible = [];
    return async.each(albums, function(album, callback) {
      return sharing.checkPermissions(album, req, function(err, isAllowed) {
        if (isAllowed && !err) {
          visible.push(album);
        }
        return callback(null);
      });
    }, function(err) {
      if (err) {
        return next(err);
      }
      return res.send(visible);
    });
  });
};

module.exports.create = function(req, res, next) {
  var album;
  album = new Album(req.body);
  return Album.create(album, function(err, album) {
    if (err) {
      return next(err);
    }
    return res.status(201).send(album);
  });
};

module.exports.read = function(req, res, next) {
  return sharing.checkPermissions(req.album, req, function(err, isAllowed) {
    if (!isAllowed) {
      return next(NotAllowed());
    } else {
      return Photo.fromAlbum(req.album, function(err, photos) {
        var out;
        if (err) {
          return next(err);
        }
        out = req.album.toObject();
        out.photos = photos;
        return res.send(out);
      });
    }
  });
};

module.exports.zip = function(req, res, next) {
  return sharing.checkPermissions(req.album, req, function(err, isAllowed) {
    var addToArchive, album, archive, makeZip, zipName;
    if (!isAllowed) {
      return next(NotAllowed());
    } else {
      album = req.album;
      archive = archiver('zip');
      zipName = slugify(req.album.title || 'Album');
      addToArchive = function(photo, cb) {
        var laterStream, type;
        if ((photo != null ? photo.binary.raw : void 0) != null) {
          type = 'raw';
        } else if ((photo != null ? photo.binary.file : void 0) != null) {
          type = 'file';
        } else {
          return cb();
        }
        laterStream = photo.getBinary(type, function(err) {
          if (err != null) {
            log.error("An error occured while adding a photo to archive. Photo: " + photo.id + ".");
            log.raw(err);
            return cb();
          }
        });
        return laterStream.on('ready', function(stream) {
          var name;
          name = photo.title || ("" + photo.id + ".jpg");
          archive.append(stream, {
            name: name
          });
          return cb();
        });
      };
      makeZip = function(zipName, photos) {
        var disposition;
        archive.pipe(res);
        res.on('close', function() {
          return archive.abort();
        });
        disposition = "attachment; filename=\"" + zipName + ".zip\"";
        res.setHeader('Content-Disposition', disposition);
        res.setHeader('Content-Type', 'application/zip');
        return async.eachSeries(photos, addToArchive, function(err) {
          if (err) {
            return log.error("An error occured: " + err);
          } else {
            return archive.finalize();
          }
        });
      };
      return Photo.fromAlbum(req.album, function(err, photos) {
        if (err) {
          return next(err);
        } else {
          return makeZip(zipName, photos);
        }
      });
    }
  });
};

module.exports.update = function(req, res, next) {
  return req.album.updateAttributes(req.body, function(err) {
    if (err) {
      return next(err);
    }
    return res.send(req.album);
  });
};

module.exports["delete"] = function(req, res, next) {
  return req.album.destroy(function(err) {
    if (err) {
      return next(err);
    }
    Photo.fromAlbum(req.album, function(err, photos) {
      var photo, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = photos.length; _i < _len; _i++) {
        photo = photos[_i];
        _results.push(photo.destroy(function() {}));
      }
      return _results;
    });
    return res.send({
      success: "Deletion succeded."
    });
  });
};
